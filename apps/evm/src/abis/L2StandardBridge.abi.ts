import { Abi } from 'viem';

export const l2StandardBridgeAbi: Abi = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      {
        name: '_otherBridge',
        internalType: 'address payable',
        type: 'address'
      }
    ]
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'l1Token',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'l2Token',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: false },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      },
      {
        name: 'extraData',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false
      }
    ],
    name: 'DepositFinalized'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'localToken',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'remoteToken',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: false },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      },
      {
        name: 'extraData',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false
      }
    ],
    name: 'ERC20BridgeFinalized'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'localToken',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'remoteToken',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: false },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      },
      {
        name: 'extraData',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false
      }
    ],
    name: 'ERC20BridgeInitiated'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      },
      {
        name: 'extraData',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false
      }
    ],
    name: 'ETHBridgeFinalized'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      },
      {
        name: 'extraData',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false
      }
    ],
    name: 'ETHBridgeInitiated'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'l1Token',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'l2Token',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: false },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      },
      {
        name: 'extraData',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false
      }
    ],
    name: 'WithdrawalInitiated'
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'MESSENGER',
    outputs: [
      {
        name: '',
        internalType: 'contract CrossDomainMessenger',
        type: 'address'
      }
    ]
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'OTHER_BRIDGE',
    outputs: [{ name: '', internalType: 'contract StandardBridge', type: 'address' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_localToken', internalType: 'address', type: 'address' },
      { name: '_remoteToken', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
      { name: '_minGasLimit', internalType: 'uint32', type: 'uint32' },
      { name: '_extraData', internalType: 'bytes', type: 'bytes' }
    ],
    name: 'bridgeERC20',
    outputs: []
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_localToken', internalType: 'address', type: 'address' },
      { name: '_remoteToken', internalType: 'address', type: 'address' },
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
      { name: '_minGasLimit', internalType: 'uint32', type: 'uint32' },
      { name: '_extraData', internalType: 'bytes', type: 'bytes' }
    ],
    name: 'bridgeERC20To',
    outputs: []
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: '_minGasLimit', internalType: 'uint32', type: 'uint32' },
      { name: '_extraData', internalType: 'bytes', type: 'bytes' }
    ],
    name: 'bridgeETH',
    outputs: []
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_minGasLimit', internalType: 'uint32', type: 'uint32' },
      { name: '_extraData', internalType: 'bytes', type: 'bytes' }
    ],
    name: 'bridgeETHTo',
    outputs: []
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' }
    ],
    name: 'deposits',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_localToken', internalType: 'address', type: 'address' },
      { name: '_remoteToken', internalType: 'address', type: 'address' },
      { name: '_from', internalType: 'address', type: 'address' },
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
      { name: '_extraData', internalType: 'bytes', type: 'bytes' }
    ],
    name: 'finalizeBridgeERC20',
    outputs: []
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: '_from', internalType: 'address', type: 'address' },
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
      { name: '_extraData', internalType: 'bytes', type: 'bytes' }
    ],
    name: 'finalizeBridgeETH',
    outputs: []
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: '_l1Token', internalType: 'address', type: 'address' },
      { name: '_l2Token', internalType: 'address', type: 'address' },
      { name: '_from', internalType: 'address', type: 'address' },
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
      { name: '_extraData', internalType: 'bytes', type: 'bytes' }
    ],
    name: 'finalizeDeposit',
    outputs: []
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'l1TokenBridge',
    outputs: [{ name: '', internalType: 'address', type: 'address' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'messenger',
    outputs: [
      {
        name: '',
        internalType: 'contract CrossDomainMessenger',
        type: 'address'
      }
    ]
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'string', type: 'string' }]
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: '_l2Token', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
      { name: '_minGasLimit', internalType: 'uint32', type: 'uint32' },
      { name: '_extraData', internalType: 'bytes', type: 'bytes' }
    ],
    name: 'withdraw',
    outputs: []
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: '_l2Token', internalType: 'address', type: 'address' },
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
      { name: '_minGasLimit', internalType: 'uint32', type: 'uint32' },
      { name: '_extraData', internalType: 'bytes', type: 'bytes' }
    ],
    name: 'withdrawTo',
    outputs: []
  },
  { stateMutability: 'payable', type: 'receive' }
] as const;
