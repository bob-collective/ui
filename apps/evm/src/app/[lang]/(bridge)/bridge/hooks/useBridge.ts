'use client';

import { Currency, CurrencyAmount, ERC20Token, Ether } from '@gobob/currency';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Address } from 'viem';
import { useAccount, useGasPrice } from 'wagmi';
import { USDC } from '@gobob/tokens';

import { l1StandardBridgeAbi } from '@/abis/L1StandardBridge.abi';
import { l2StandardBridgeAbi } from '@/abis/L2StandardBridge.abi';
import { chainL2, INTERVAL, L2_CHAIN, publicClientL1, publicClientL2 } from '@/constants';
import { BridgeToken, useApproval, useWalletClientL1, useWalletClientL2 } from '@/hooks';
import { posthogEvents } from '@/lib/posthog';
import { bridgeKeys } from '@/lib/react-query';
import {
  BridgeTransaction,
  BridgeTransactionStatus,
  InitBridgeTransaction,
  TransactionDirection,
  TransactionType
} from '@/types';
import { bridgeContracts } from '@/constants/bridge';

const getBridgeContract = (currency: Ether | ERC20Token) =>
  currency.isToken ? bridgeContracts[currency.symbol]?.[L2_CHAIN] || bridgeContracts.Standard : bridgeContracts.ETH;

type UseBridgeProps = {
  direction: TransactionDirection;
  gasToken: Ether;
  isBridgeDisabled: boolean;
  currencyAmount?: CurrencyAmount<Currency>;
  selectedToken?: BridgeToken;
  selectedCurrency: Ether | ERC20Token | undefined;
  onSuccess: (data: BridgeTransaction) => void;
  onError: (data: BridgeTransaction) => void;
};

const useBridge = ({
  direction,
  isBridgeDisabled,
  gasToken,
  currencyAmount,
  selectedCurrency,
  selectedToken,
  onError,
  onSuccess
}: UseBridgeProps) => {
  const { address } = useAccount();
  const walletClientL1 = useWalletClientL1();
  const walletClientL2 = useWalletClientL2();
  const { data: gasPrice } = useGasPrice();

  const evmBridgePosthogEvents = direction === TransactionDirection.L1_TO_L2 ? 'deposit' : 'withdraw';

  const bridgeContract = selectedCurrency && getBridgeContract(selectedCurrency);

  const isFetchAllowanceRequired =
    !isBridgeDisabled &&
    currencyAmount &&
    currencyAmount.currency.isToken &&
    (direction === TransactionDirection.L1_TO_L2 ||
      (direction === TransactionDirection.L2_TO_L1 && USDC?.[L2_CHAIN]?.equals(currencyAmount.currency)));

  const approval = useApproval({
    amount: currencyAmount,
    spender:
      isFetchAllowanceRequired && bridgeContract
        ? direction === TransactionDirection.L1_TO_L2
          ? bridgeContract.l1Bridge
          : bridgeContract.l2Bridge
        : undefined,
    onApprovalSuccess: () => {
      posthogEvents.bridge.evm.approval(evmBridgePosthogEvents, {
        ticker: currencyAmount?.currency.symbol as string,
        amount: currencyAmount?.toExact() as string
      });
    }
  });

  const approvalGasEstimate = useQuery({
    enabled: Boolean(approval.isApproveRequired && approval.approveSimulate && gasPrice),
    queryKey: bridgeKeys.gasEstimate(
      direction,
      address,
      selectedToken?.l1Token.address,
      selectedToken?.l2Token.address
    ),
    queryFn: async () => {
      if (!approval.approveSimulate || !gasPrice) return;

      if (direction === TransactionDirection.L1_TO_L2) {
        const gas = await publicClientL1.estimateContractGas(approval.approveSimulate.request);

        return CurrencyAmount.fromRawAmount(gasToken, gas).multiply(gasPrice);
      }

      const gas = await publicClientL2.estimateContractGas(approval.approveSimulate.request);

      return CurrencyAmount.fromRawAmount(gasToken, gas).multiply(gasPrice);
    },
    refetchInterval: INTERVAL.SECONDS_30
  });

  const gasEstimate = useQuery({
    enabled: Boolean(
      !isBridgeDisabled && address && selectedToken && gasPrice && currencyAmount && currencyAmount.greaterThan(0)
    ),
    queryKey: bridgeKeys.gasEstimate(
      direction,
      address,
      selectedToken?.l1Token.address,
      selectedToken?.l2Token.address
    ),
    queryFn: async () => {
      if (!selectedToken || !currencyAmount || !bridgeContract || !gasPrice) return;

      const l1Address = selectedToken.l1Token.address;
      const l2Address = selectedToken.l2Token.address;

      const to = address!;
      const amount = BigInt(currencyAmount.numerator);

      if (direction === TransactionDirection.L1_TO_L2) {
        if (currencyAmount.currency.isNative) {
          // simulate deposit
          const args = await publicClientL2.buildDepositTransaction({
            account: address!,
            mint: amount,
            to
          });

          const gas = await publicClientL1.estimateDepositTransactionGas({
            account: address!,
            request: args.request,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            targetChain: chainL2 as any
          });

          return CurrencyAmount.fromRawAmount(gasToken, gas).multiply(gasPrice);
        }

        const { request } = await publicClientL1.simulateContract({
          account: address,
          abi: l1StandardBridgeAbi,
          address: bridgeContract.l1Bridge,
          functionName: 'depositERC20To',
          args: [l1Address, l2Address, to, amount, 0, '0x']
        });

        const gas = await publicClientL1.estimateContractGas(request);

        return CurrencyAmount.fromRawAmount(gasToken, gas).multiply(gasPrice);
      }

      if (currencyAmount.currency.isNative) {
        // simulate withdrawal
        const args = await publicClientL1.buildInitiateWithdrawal({
          account: address!,
          value: amount,
          to
        });

        const gas = await publicClientL2.estimateInitiateWithdrawalGas({
          account: address!,
          request: args.request
        });

        return CurrencyAmount.fromRawAmount(gasToken, gas).multiply(gasPrice);
      }

      const { request } = await publicClientL2.simulateContract({
        account: address,
        abi: l2StandardBridgeAbi,
        address: bridgeContract.l2Bridge,
        functionName: 'withdrawTo',
        args: [l2Address, to, amount, 0, '0x']
      });

      const gas = await publicClientL2.estimateContractGas(request);

      return CurrencyAmount.fromRawAmount(gasToken, gas).multiply(gasPrice);
    },
    refetchInterval: INTERVAL.SECONDS_30
  });

  const deposit = useMutation({
    mutationKey: bridgeKeys.deposit(address),
    mutationFn: async ({
      currencyAmount,
      selectedToken,
      recipient
    }: {
      selectedToken: BridgeToken;
      currencyAmount: CurrencyAmount<ERC20Token | Ether>;
      recipient: Address;
    }): Promise<BridgeTransaction> => {
      if (!(bridgeContract && bridgeContract.l1Bridge)) {
        throw new Error('Contract missing');
      }

      posthogEvents.bridge.evm.initiated(evmBridgePosthogEvents, {
        ticker: currencyAmount.currency.symbol,
        amount: currencyAmount.toExact()
      });

      const l1Address = selectedToken.l1Token.address;
      const l2Address = selectedToken.l2Token.address;

      const data: InitBridgeTransaction = {
        amount: currencyAmount,
        direction: TransactionDirection.L1_TO_L2,
        from: address!,
        to: recipient,
        l1Token: l1Address,
        l2Token: l2Address,
        type: TransactionType.Bridge,
        logoUrl: selectedToken.l1Token.logoUrl
      };

      const to = recipient || address!;
      const amount = BigInt(currencyAmount.numerator);

      if (currencyAmount.currency.isNative) {
        // simulate deposit
        const args = await publicClientL2.buildDepositTransaction({
          account: address!,
          mint: amount,
          to
        });

        const transactionHash = await walletClientL1.depositTransaction(args);

        return {
          ...data,
          transactionHash,
          status: BridgeTransactionStatus.UNCONFIRMED_L1_TO_L2_MESSAGE,
          date: new Date()
        };
      }

      const { request } = await publicClientL1.simulateContract({
        account: address,
        abi: l1StandardBridgeAbi,
        address: bridgeContract.l1Bridge,
        functionName: 'depositERC20To',
        args: [l1Address, l2Address, to, amount, 0, '0x']
      });

      const transactionHash = await walletClientL1.writeContract(request);

      return {
        ...data,
        transactionHash,
        status: BridgeTransactionStatus.UNCONFIRMED_L1_TO_L2_MESSAGE,
        date: new Date()
      };
    },
    onSuccess,
    onError
  });

  const withdraw = useMutation({
    mutationKey: bridgeKeys.withdraw(address),
    mutationFn: async ({
      currencyAmount,
      selectedToken,
      recipient
    }: {
      selectedToken: BridgeToken;
      currencyAmount: CurrencyAmount<ERC20Token | Ether>;
      recipient: Address;
    }): Promise<BridgeTransaction> => {
      if (!(bridgeContract && bridgeContract.l1Bridge)) {
        throw new Error('Contract missing');
      }

      posthogEvents.bridge.evm.initiated(evmBridgePosthogEvents, {
        ticker: currencyAmount.currency.symbol,
        amount: currencyAmount.toExact()
      });

      const l1Address = selectedToken.l1Token.address;
      const l2Address = selectedToken.l2Token.address;

      const data: InitBridgeTransaction = {
        amount: currencyAmount,
        direction: TransactionDirection.L2_TO_L1,
        from: address!,
        to: recipient,
        l1Token: l1Address,
        l2Token: l2Address,
        type: TransactionType.Bridge,
        logoUrl: selectedToken.l2Token.logoUrl
      };

      const to = recipient || address!;
      const amount = BigInt(currencyAmount.numerator);

      if (currencyAmount.currency.isNative) {
        // simulate withdrawal
        const args = await publicClientL1.buildInitiateWithdrawal({
          account: address!,
          value: amount,
          to
        });

        const transactionHash = await walletClientL2.initiateWithdrawal(args);

        return {
          ...data,
          transactionHash,
          status: BridgeTransactionStatus.STATE_ROOT_NOT_PUBLISHED,
          date: new Date()
        };
      }

      const { request } = await publicClientL2.simulateContract({
        account: address,
        abi: l2StandardBridgeAbi,
        address: bridgeContract.l2Bridge,
        functionName: 'withdrawTo',
        args: [l2Address, to, amount, 0, '0x']
      });

      const transactionHash = await walletClientL2.writeContract(request);

      return {
        ...data,
        transactionHash,
        status: BridgeTransactionStatus.STATE_ROOT_NOT_PUBLISHED,
        date: new Date()
      };
    },
    onSuccess,
    onError
  });

  return {
    deposit,
    withdraw,
    gasEstimate,
    approval,
    approvalGasEstimate
  };
};

export { useBridge };
