# BobBridge Transactions

## Deposits from L1 to L2

To access user deposit transactions from Layer 1 (L1) to Layer 2 (L2), utilize the GraphQL (GQL) endpoints provided below:

### GQL Endpoints:

- **Testnet:** `https://api.goldsky.com/api/public/project_clto8zgmd1jbw01xig1ge1u0h/subgraphs/bridge-deposits-sepolia/1.0/gn`
- **Mainnet:** `https://api.goldsky.com/api/public/project_clto8zgmd1jbw01xig1ge1u0h/subgraphs/bridge-deposits-mainnet/1.0/gn`

### Get All ERC20 Deposits by Address

Replace `0x854AD5bFCF0617D77Ef519c628C4037e8F88c2F6` with the user address:

```json
{
	erc20BridgeInitiateds( where:{from_starts_with_nocase:"0x854AD5bFCF0617D77Ef519c628C4037e8F88c2F6"}) {
        localToken
        remoteToken
        from
        to
        block_number
        transactionHash_
        amount
  }
}
```

### Get All ETH Deposits by Address

Replace `0x74f65E8feaCC744e0A6Bf654aB75F0A2aee434e2` with the user address:

```json
{
  ethbridgeInitiateds(where:{from_starts_with_nocase:"0x854AD5bFCF0617D77Ef519c628C4037e8F88c2F6"}) {
      from
      to
      block_number
      transactionHash_
      amount
  }
}
```

## Withdrawals from L2 to L1

For accessing user withdrawal transactions from Layer 2 (L2) to Layer 1 (L1), use the following GQL endpoints:

### GQL Endpoints:

- **Testnet:** `https://api.goldsky.com/api/public/project_clto8zgmd1jbw01xig1ge1u0h/subgraphs/bridge-withdraws-bob-testnet/1.0/gn`
- **Mainnet:** `https://api.goldsky.com/api/public/project_clto8zgmd1jbw01xig1ge1u0h/subgraphs/bridge-withdraws-bob/1.0/gn`

### Get All ERC20 Withdrawals by Address

Replace `0x02c6107638Dd465D504117043A0F68693D9c64A7` with the user address:

```json
{
	erc20BridgeInitiateds( where:{from_starts_with_nocase:"0x02c6107638Dd465D504117043A0F68693D9c64A7"}) {
    localToken
    remoteToken
    from
    to
    block_number
    transactionHash_
    amount
  }
}
```

### Get All ETH Withdrawals by Address

Replace `0xFAEe001465dE6D7E8414aCDD9eF4aC5A35B2B808` with the user address:

```json
{
	ethbridgeInitiateds( where:{from_starts_with_nocase:"0xFAEe001465dE6D7E8414aCDD9eF4aC5A35B2B808"}) {
    from
    to
    block_number
    transactionHash_
    amount
  }
}
```

---
