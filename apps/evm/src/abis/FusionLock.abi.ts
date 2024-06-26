export const FusionLockAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'setWithdrawalStartTime',
        type: 'uint256',
        internalType: 'uint256'
      },
      {
        name: 'allowTokens',
        type: 'address[]',
        internalType: 'address[]'
      },
      {
        name: 'initialOwner',
        type: 'address',
        internalType: 'address'
      }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'fallback',
    stateMutability: 'payable'
  },
  {
    type: 'receive',
    stateMutability: 'payable'
  },
  {
    type: 'function',
    name: 'ETH_TOKEN_ADDRESS',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'allow',
    inputs: [
      {
        name: 'l1TokenAddress',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'l2TokenAddress',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'l1BridgeAddressOverride',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'allowedTokens',
    inputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [
      {
        name: 'isAllowed',
        type: 'bool',
        internalType: 'bool'
      },
      {
        name: 'l2TokenAddress',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'l1BridgeAddressOverride',
        type: 'address',
        internalType: 'address'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'bridgeProxyAddress',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'changeMultipleL2TokenData',
    inputs: [
      {
        name: 'tokenData',
        type: 'tuple[]',
        internalType: 'struct FusionLock.TokenBridgingData[]',
        components: [
          {
            name: 'l1TokenAddress',
            type: 'address',
            internalType: 'address'
          },
          {
            name: 'l2TokenAddress',
            type: 'address',
            internalType: 'address'
          },
          {
            name: 'l1BridgeAddressOverride',
            type: 'address',
            internalType: 'address'
          }
        ]
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'changeWithdrawalTime',
    inputs: [
      {
        name: 'newWithdrawalStartTime',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'depositERC20',
    inputs: [
      {
        name: 'token',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'amount',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'depositEth',
    inputs: [],
    outputs: [],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    name: 'deposits',
    inputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address'
      },
      {
        name: '',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getDepositAmount',
    inputs: [
      {
        name: 'depositOwner',
        type: 'address',
        internalType: 'address'
      },
      {
        name: 'token',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getEthBalance',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getTokenInfo',
    inputs: [
      {
        name: 'token',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct FusionLock.TokenInfo',
        components: [
          {
            name: 'isAllowed',
            type: 'bool',
            internalType: 'bool'
          },
          {
            name: 'l2TokenAddress',
            type: 'address',
            internalType: 'address'
          },
          {
            name: 'l1BridgeAddressOverride',
            type: 'address',
            internalType: 'address'
          }
        ]
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'isWithdrawalTimeStarted',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'pause',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'paused',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'renounceOwnership',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'saveTokens',
    inputs: [
      {
        name: 'tokenData',
        type: 'tuple[]',
        internalType: 'struct FusionLock.SaveTokenData[]',
        components: [
          {
            name: 'user',
            type: 'address',
            internalType: 'address'
          },
          {
            name: 'token',
            type: 'address',
            internalType: 'address'
          },
          {
            name: 'amount',
            type: 'uint256',
            internalType: 'uint256'
          }
        ]
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'setBridgeProxyAddress',
    inputs: [
      {
        name: 'l2BridgeProxyAddress',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'totalDeposits',
    inputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'transferOwnership',
    inputs: [
      {
        name: 'newOwner',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'unpause',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'withdrawDepositsToL1',
    inputs: [
      {
        name: 'tokens',
        type: 'address[]',
        internalType: 'address[]'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'withdrawDepositsToL2',
    inputs: [
      {
        name: 'tokens',
        type: 'address[]',
        internalType: 'address[]'
      },
      {
        name: 'minGasLimit',
        type: 'uint32',
        internalType: 'uint32'
      },
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address'
      }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'withdrawalStartTime',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'event',
    name: 'BridgeAddress',
    inputs: [
      {
        name: 'bridgeAddress',
        type: 'address',
        indexed: false,
        internalType: 'address'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'Deposit',
    inputs: [
      {
        name: 'depositOwner',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'token',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
      },
      {
        name: 'depositTime',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'OwnershipTransferred',
    inputs: [
      {
        name: 'previousOwner',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'newOwner',
        type: 'address',
        indexed: true,
        internalType: 'address'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'Paused',
    inputs: [
      {
        name: 'account',
        type: 'address',
        indexed: false,
        internalType: 'address'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'SavedToken',
    inputs: [
      {
        name: 'user',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'token',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'TokenAllowed',
    inputs: [
      {
        name: 'token',
        type: 'address',
        indexed: false,
        internalType: 'address'
      },
      {
        name: 'info',
        type: 'tuple',
        indexed: false,
        internalType: 'struct FusionLock.TokenInfo',
        components: [
          {
            name: 'isAllowed',
            type: 'bool',
            internalType: 'bool'
          },
          {
            name: 'l2TokenAddress',
            type: 'address',
            internalType: 'address'
          },
          {
            name: 'l1BridgeAddressOverride',
            type: 'address',
            internalType: 'address'
          }
        ]
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'TokenDataChange',
    inputs: [
      {
        name: 'l1Token',
        type: 'address',
        indexed: false,
        internalType: 'address'
      },
      {
        name: 'l2Token',
        type: 'address',
        indexed: false,
        internalType: 'address'
      },
      {
        name: 'l1Bridge',
        type: 'address',
        indexed: false,
        internalType: 'address'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'Unpaused',
    inputs: [
      {
        name: 'account',
        type: 'address',
        indexed: false,
        internalType: 'address'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'WithdrawToL1',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'token',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'WithdrawToL2',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'receiver',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'l1Token',
        type: 'address',
        indexed: true,
        internalType: 'address'
      },
      {
        name: 'l2Token',
        type: 'address',
        indexed: false,
        internalType: 'address'
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
      }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'WithdrawalTimeUpdated',
    inputs: [
      {
        name: 'endTime',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256'
      }
    ],
    anonymous: false
  },
  {
    type: 'error',
    name: 'AddressEmptyCode',
    inputs: [
      {
        name: 'target',
        type: 'address',
        internalType: 'address'
      }
    ]
  },
  {
    type: 'error',
    name: 'AddressInsufficientBalance',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address'
      }
    ]
  },
  {
    type: 'error',
    name: 'EnforcedPause',
    inputs: []
  },
  {
    type: 'error',
    name: 'ExpectedPause',
    inputs: []
  },
  {
    type: 'error',
    name: 'FailedInnerCall',
    inputs: []
  },
  {
    type: 'error',
    name: 'OwnableInvalidOwner',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        internalType: 'address'
      }
    ]
  },
  {
    type: 'error',
    name: 'OwnableUnauthorizedAccount',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address'
      }
    ]
  },
  {
    type: 'error',
    name: 'SafeERC20FailedOperation',
    inputs: [
      {
        name: 'token',
        type: 'address',
        internalType: 'address'
      }
    ]
  }
] as const;
