# BobBridge Transactions

## Deposits from L1 to L2

To access user deposit transactions from Layer 1 (L1) to Layer 2 (L2), utilize the GraphQL (GQL) endpoints provided below:

### GQL Endpoints:

- **Old Testnet:** `https://api.goldsky.com/api/public/project_clto8zgmd1jbw01xig1ge1u0h/subgraphs/bridge-deposits-sepolia/1.0/gn`
- **New Testnet:** `https://api.goldsky.com/api/public/project_clto8zgmd1jbw01xig1ge1u0h/subgraphs/testnet-bridge-deposits-sepolia/test/gn`
- **Mainnet:** `https://api.goldsky.com/api/public/project_clto8zgmd1jbw01xig1ge1u0h/subgraphs/bridge-deposits-mainnet/prod/gn`

### Get All ERC20 Deposits by Address

Replace `0x97632B3760460A623E068CC70aBF11D5fA99Be5f` with the user address:

```graphql
query getERC20Deposits_StandardAndCustomBridges_WSETH_USDC {
    erc20DepositInitiateds(
        where: {
            from_starts_with_nocase: "0x97632B3760460A623E068CC70aBF11D5fA99Be5f"
        }
    ) {
        l1Token
        l2Token
        from
        to
        block_number
        transactionHash_
        amount
    }
}
```

### Get All ETH Deposits by Address

Replace `0x97632B3760460A623E068CC70aBF11D5fA99Be5f` with the user address:

- The first query will give deposit initiated through `L1StandardBridgeProxy` Contract
- The second query will give deposit initiated through `OptimismPortalProxy` Contract
- Merge Records from both queries to get all the ETH Deposit done by user

```graphql
query ThroughL1StandardBridge {
  ethbridgeInitiateds(where: { from_starts_with_nocase: "0x97632B3760460A623E068CC70aBF11D5fA99Be5f" }) {
    from
    to
    block_number
    transactionHash_
    amount
  }
}
```

```graphql
query ThroughOptimismPortal {
  transactionDepositeds(where: { from_starts_with_nocase: "0x97632B3760460A623E068CC70aBF11D5fA99Be5f" }) {
    from
    to
    block_number
    transactionHash_
    opaqueData
  }
}
```

## Withdrawals from L2 to L1

For accessing user withdrawal transactions from Layer 2 (L2) to Layer 1 (L1), use the following GQL endpoints:

### GQL Endpoints:

- **Old Testnet:** `https://api.goldsky.com/api/public/project_clto8zgmd1jbw01xig1ge1u0h/subgraphs/bridge-withdraws-bob-testnet/1.0/gn`
- **New Testnet:** `https://api.goldsky.com/api/public/project_clto8zgmd1jbw01xig1ge1u0h/subgraphs/testnet-bridge-withdraws-bob-sepolia/test/gn`
- **Mainnet:** `https://api.goldsky.com/api/public/project_clto8zgmd1jbw01xig1ge1u0h/subgraphs/bridge-withdraws-bob/prod/gn`

### Get All ERC20 Withdrawals by Address

Replace `0x97632B3760460A623E068CC70aBF11D5fA99Be5f` with the user address:

```graphql
query getERC20Withdrawals_StandardAndCustomBridges_WSETH_USDC {
    withdrawalInitiateds(
        where: {
            from_starts_with_nocase: "0x97632B3760460A623E068CC70aBF11D5fA99Be5f"
        }
    ) {
        l1Token
        l2Token
        from
        to
        block_number
        transactionHash_
        amount
    }
}
```

### Get All ETH Withdrawals by Address

Replace `0x97632B3760460A623E068CC70aBF11D5fA99Be5f` with the user address:

- The first query will give withdraws initiated through `L2StandardBridge` Contract
- The second query will give withdraws initiated through `L2ToL1MessagePasser` Contract
- Merge Records from both queries to get all the ETH Withdraws done by user

```graphql
query ThroughL2StandardBridgeOnBob {
  ethbridgeInitiateds(where: { from_starts_with_nocase: "0x97632B3760460A623E068CC70aBF11D5fA99Be5f" }) {
    from
    to
    block_number
    transactionHash_
    amount
  }
}
```

```graphql
query ThroughL2MessagePasserOnBob {
  messagePasseds(where: { sender_starts_with_nocase: "0x97632B3760460A623E068CC70aBF11D5fA99Be5f" }) {
    from: sender
    to: target
    block_number
    transactionHash_
    amount: value
  }
}
```

---
