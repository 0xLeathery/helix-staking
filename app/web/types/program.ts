/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/helix_staking.json`.
 */
export type HelixStaking = {
  "address": "E9B7BsxdPS89M66CRGGbsCzQ9LkiGv6aNsra3cNBJha7",
  "metadata": {
    "name": "helixStaking",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "HELIX staking protocol on Solana"
  },
  "instructions": [
    {
      "name": "adminMint",
      "discriminator": [
        137,
        144,
        88,
        222,
        36,
        159,
        250,
        217
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "globalState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "mintAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  105,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "mint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  101,
                  108,
                  105,
                  120,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "recipientTokenAccount",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "claimRewards",
      "discriminator": [
        4,
        144,
        132,
        71,
        116,
        23,
        151,
        80
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "globalState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "stakeAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  107,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "account",
                "path": "stake_account.stake_id",
                "account": "stakeAccount"
              }
            ]
          }
        },
        {
          "name": "userTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "mint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  101,
                  108,
                  105,
                  120,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "mintAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  105,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "crankDistribution",
      "discriminator": [
        44,
        53,
        113,
        176,
        123,
        218,
        125,
        236
      ],
      "accounts": [
        {
          "name": "cranker",
          "docs": [
            "Cranker - anyone can call this (permissionless)"
          ],
          "signer": true
        },
        {
          "name": "globalState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "mint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  101,
                  108,
                  105,
                  120,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "mintAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  105,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        }
      ],
      "args": []
    },
    {
      "name": "createStake",
      "discriminator": [
        201,
        134,
        55,
        171,
        2,
        136,
        228,
        226
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "globalState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "stakeAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  107,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "account",
                "path": "global_state.total_stakes_created",
                "account": "globalState"
              }
            ]
          }
        },
        {
          "name": "userTokenAccount",
          "writable": true
        },
        {
          "name": "mint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  101,
                  108,
                  105,
                  120,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "days",
          "type": "u16"
        }
      ]
    },
    {
      "name": "finalizeBpdCalculation",
      "discriminator": [
        168,
        35,
        96,
        41,
        68,
        237,
        90,
        175
      ],
      "accounts": [
        {
          "name": "caller",
          "docs": [
            "Anyone can call this (permissionless)"
          ],
          "signer": true
        },
        {
          "name": "globalState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "claimConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  97,
                  105,
                  109,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "freeClaim",
      "discriminator": [
        51,
        151,
        201,
        80,
        123,
        35,
        134,
        88
      ],
      "accounts": [
        {
          "name": "claimer",
          "docs": [
            "The wallet receiving the tokens (pays rent for ClaimStatus)"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "snapshotWallet",
          "docs": [
            "The snapshot wallet that signed the claim message",
            "Must equal claimer - delegation not supported (see MEDIUM-3 security fix)"
          ]
        },
        {
          "name": "globalState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "claimConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  97,
                  105,
                  109,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "claimStatus",
          "writable": true
        },
        {
          "name": "claimerTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "claimer"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "mint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  101,
                  108,
                  105,
                  120,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "mintAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  105,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "instructionsSysvar",
          "address": "Sysvar1nstructions1111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "snapshotBalance",
          "type": "u64"
        },
        {
          "name": "proof",
          "type": {
            "vec": {
              "array": [
                "u8",
                32
              ]
            }
          }
        }
      ]
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "globalState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "mintAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  105,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "mint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  101,
                  108,
                  105,
                  120,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "initializeParams"
            }
          }
        }
      ]
    },
    {
      "name": "initializeClaimPeriod",
      "discriminator": [
        86,
        246,
        42,
        160,
        96,
        102,
        239,
        46
      ],
      "accounts": [
        {
          "name": "authority",
          "docs": [
            "Protocol authority (must match GlobalState.authority)"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "globalState",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "claimConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  97,
                  105,
                  109,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "merkleRoot",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "totalClaimable",
          "type": "u64"
        },
        {
          "name": "totalEligible",
          "type": "u32"
        },
        {
          "name": "claimPeriodId",
          "type": "u32"
        }
      ]
    },
    {
      "name": "migrateStake",
      "discriminator": [
        178,
        5,
        26,
        85,
        56,
        20,
        153,
        160
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "stakeAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  107,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "stake_account.user",
                "account": "stakeAccount"
              },
              {
                "kind": "account",
                "path": "stake_account.stake_id",
                "account": "stakeAccount"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "sealBpdFinalize",
      "discriminator": [
        81,
        57,
        216,
        117,
        15,
        53,
        182,
        237
      ],
      "accounts": [
        {
          "name": "authority",
          "docs": [
            "Authority that can seal the finalize phase"
          ],
          "signer": true
        },
        {
          "name": "globalState",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "claimConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  97,
                  105,
                  109,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "triggerBigPayDay",
      "discriminator": [
        5,
        177,
        111,
        68,
        185,
        201,
        153,
        98
      ],
      "accounts": [
        {
          "name": "caller",
          "docs": [
            "Anyone can trigger BPD (permissionless)"
          ],
          "signer": true
        },
        {
          "name": "globalState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "claimConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  97,
                  105,
                  109,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "unstake",
      "discriminator": [
        90,
        95,
        107,
        42,
        205,
        124,
        50,
        225
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "globalState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "stakeAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  107,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "account",
                "path": "stake_account.stake_id",
                "account": "stakeAccount"
              }
            ]
          }
        },
        {
          "name": "userTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "mint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  101,
                  108,
                  105,
                  120,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "mintAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  105,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        }
      ],
      "args": []
    },
    {
      "name": "withdrawVested",
      "discriminator": [
        104,
        188,
        52,
        194,
        35,
        234,
        95,
        149
      ],
      "accounts": [
        {
          "name": "claimer",
          "writable": true,
          "signer": true
        },
        {
          "name": "globalState",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "claimConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  97,
                  105,
                  109,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "claimStatus",
          "writable": true
        },
        {
          "name": "claimerTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "claimer"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "mint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  101,
                  108,
                  105,
                  120,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "mintAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  105,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "claimConfig",
      "discriminator": [
        97,
        212,
        121,
        122,
        13,
        163,
        67,
        234
      ]
    },
    {
      "name": "claimStatus",
      "discriminator": [
        22,
        183,
        249,
        157,
        247,
        95,
        150,
        96
      ]
    },
    {
      "name": "globalState",
      "discriminator": [
        163,
        46,
        74,
        168,
        216,
        123,
        133,
        98
      ]
    },
    {
      "name": "stakeAccount",
      "discriminator": [
        80,
        158,
        67,
        124,
        50,
        189,
        192,
        255
      ]
    }
  ],
  "events": [
    {
      "name": "adminMinted",
      "discriminator": [
        208,
        107,
        215,
        166,
        197,
        183,
        237,
        25
      ]
    },
    {
      "name": "bigPayDayDistributed",
      "discriminator": [
        213,
        15,
        42,
        99,
        162,
        154,
        104,
        198
      ]
    },
    {
      "name": "claimPeriodEnded",
      "discriminator": [
        51,
        71,
        234,
        81,
        235,
        74,
        51,
        215
      ]
    },
    {
      "name": "claimPeriodStarted",
      "discriminator": [
        40,
        207,
        215,
        97,
        99,
        12,
        184,
        182
      ]
    },
    {
      "name": "inflationDistributed",
      "discriminator": [
        59,
        156,
        4,
        240,
        248,
        237,
        191,
        7
      ]
    },
    {
      "name": "protocolInitialized",
      "discriminator": [
        173,
        122,
        168,
        254,
        9,
        118,
        76,
        132
      ]
    },
    {
      "name": "rewardsClaimed",
      "discriminator": [
        75,
        98,
        88,
        18,
        219,
        112,
        88,
        121
      ]
    },
    {
      "name": "stakeCreated",
      "discriminator": [
        167,
        95,
        138,
        168,
        40,
        144,
        148,
        196
      ]
    },
    {
      "name": "stakeEnded",
      "discriminator": [
        152,
        154,
        120,
        192,
        223,
        130,
        115,
        219
      ]
    },
    {
      "name": "tokensClaimed",
      "discriminator": [
        25,
        128,
        244,
        55,
        241,
        136,
        200,
        91
      ]
    },
    {
      "name": "vestedTokensWithdrawn",
      "discriminator": [
        253,
        140,
        32,
        181,
        2,
        211,
        97,
        129
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "overflow",
      "msg": "Arithmetic overflow"
    },
    {
      "code": 6001,
      "name": "underflow",
      "msg": "Arithmetic underflow"
    },
    {
      "code": 6002,
      "name": "unauthorized",
      "msg": "Unauthorized access"
    },
    {
      "code": 6003,
      "name": "invalidParameter",
      "msg": "Invalid parameter value"
    },
    {
      "code": 6004,
      "name": "alreadyInitialized",
      "msg": "Account already initialized"
    },
    {
      "code": 6005,
      "name": "stakeBelowMinimum",
      "msg": "Stake amount below minimum"
    },
    {
      "code": 6006,
      "name": "claimPeriodActive",
      "msg": "Claim period has not ended"
    },
    {
      "code": 6007,
      "name": "claimPeriodEnded",
      "msg": "Claim period has ended"
    },
    {
      "code": 6008,
      "name": "invalidMerkleProof",
      "msg": "Invalid Merkle proof"
    },
    {
      "code": 6009,
      "name": "alreadyClaimed",
      "msg": "Tokens already claimed"
    },
    {
      "code": 6010,
      "name": "invalidMintSpace",
      "msg": "Failed to calculate mint account space"
    },
    {
      "code": 6011,
      "name": "invalidStakeDuration",
      "msg": "Invalid stake duration (must be 1-5555 days)"
    },
    {
      "code": 6012,
      "name": "stakeNotActive",
      "msg": "Stake is not active"
    },
    {
      "code": 6013,
      "name": "stakeAlreadyClosed",
      "msg": "Stake is already closed"
    },
    {
      "code": 6014,
      "name": "unauthorizedStakeAccess",
      "msg": "Unauthorized stake access"
    },
    {
      "code": 6015,
      "name": "alreadyDistributedToday",
      "msg": "Distribution already completed for current day"
    },
    {
      "code": 6016,
      "name": "noActiveShares",
      "msg": "No active shares for distribution"
    },
    {
      "code": 6017,
      "name": "noRewardsToClaim",
      "msg": "No rewards to claim"
    },
    {
      "code": 6018,
      "name": "divisionByZero",
      "msg": "Division by zero"
    },
    {
      "code": 6019,
      "name": "adminMintCapExceeded",
      "msg": "Admin mint cap exceeded"
    },
    {
      "code": 6020,
      "name": "claimPeriodNotStarted",
      "msg": "Claim period not yet started"
    },
    {
      "code": 6021,
      "name": "claimPeriodAlreadyStarted",
      "msg": "Claim period already started"
    },
    {
      "code": 6022,
      "name": "bigPayDayAlreadyTriggered",
      "msg": "Big Pay Day already triggered"
    },
    {
      "code": 6023,
      "name": "bigPayDayNotAvailable",
      "msg": "Big Pay Day not yet available"
    },
    {
      "code": 6024,
      "name": "invalidSignature",
      "msg": "Invalid Ed25519 signature"
    },
    {
      "code": 6025,
      "name": "missingEd25519Instruction",
      "msg": "Missing Ed25519 verification instruction"
    },
    {
      "code": 6026,
      "name": "noVestedTokens",
      "msg": "No vested tokens available"
    },
    {
      "code": 6027,
      "name": "insufficientVestedBalance",
      "msg": "Insufficient vested balance"
    },
    {
      "code": 6028,
      "name": "noEligibleStakers",
      "msg": "No eligible stakers for Big Pay Day"
    },
    {
      "code": 6029,
      "name": "stakeNotBpdEligible",
      "msg": "Stake not eligible for Big Pay Day"
    },
    {
      "code": 6030,
      "name": "snapshotBalanceTooLow",
      "msg": "Snapshot balance below minimum"
    },
    {
      "code": 6031,
      "name": "rewardDebtOverflow",
      "msg": "Reward debt calculation exceeds maximum storable value"
    },
    {
      "code": 6032,
      "name": "bpdCalculationNotComplete",
      "msg": "BPD rate calculation not yet complete"
    },
    {
      "code": 6033,
      "name": "bpdCalculationAlreadyComplete",
      "msg": "BPD rate calculation already finalized"
    },
    {
      "code": 6034,
      "name": "unstakeBlockedDuringBpd",
      "msg": "Unstaking is temporarily blocked during Big Pay Day calculation"
    },
    {
      "code": 6035,
      "name": "invalidClaimPeriodId",
      "msg": "Claim period ID must be greater than 0"
    },
    {
      "code": 6036,
      "name": "bpdOverDistribution",
      "msg": "BPD distribution exceeded remaining pool"
    },
    {
      "code": 6037,
      "name": "stakeNotFinalized",
      "msg": "Stake not counted in BPD finalize phase"
    }
  ],
  "types": [
    {
      "name": "adminMinted",
      "docs": [
        "Emitted when authority mints tokens via admin_mint instruction.",
        "Frontend note: Monitor for transparency. Production should use multisig authority."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "slot",
            "type": "u64"
          },
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "recipient",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "bigPayDayDistributed",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "slot",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "claimPeriodId",
            "type": "u32"
          },
          {
            "name": "totalUnclaimed",
            "type": "u64"
          },
          {
            "name": "totalEligibleShareDays",
            "type": "u64"
          },
          {
            "name": "helixPerShareDay",
            "type": "u64"
          },
          {
            "name": "eligibleStakers",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "claimConfig",
      "docs": [
        "Global claim period configuration (singleton PDA)",
        "Seeds: [b\"claim_config\"]"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "docs": [
              "DEPRECATED: Authority checked via GlobalState constraint. Kept for layout compatibility."
            ],
            "type": "pubkey"
          },
          {
            "name": "merkleRoot",
            "docs": [
              "Merkle root of the snapshot"
            ],
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "totalClaimable",
            "docs": [
              "Total tokens available for claiming"
            ],
            "type": "u64"
          },
          {
            "name": "totalClaimed",
            "docs": [
              "Total tokens claimed so far"
            ],
            "type": "u64"
          },
          {
            "name": "claimCount",
            "docs": [
              "Number of successful claims"
            ],
            "type": "u32"
          },
          {
            "name": "startSlot",
            "docs": [
              "Slot when claim period started"
            ],
            "type": "u64"
          },
          {
            "name": "endSlot",
            "docs": [
              "Slot when claim period ends (start + 180 days)"
            ],
            "type": "u64"
          },
          {
            "name": "claimPeriodId",
            "docs": [
              "Claim period identifier (for future multi-period support)"
            ],
            "type": "u32"
          },
          {
            "name": "claimPeriodStarted",
            "docs": [
              "True once claim period has started (merkle root immutable after this)"
            ],
            "type": "bool"
          },
          {
            "name": "bigPayDayComplete",
            "docs": [
              "True once Big Pay Day has been triggered and fully distributed"
            ],
            "type": "bool"
          },
          {
            "name": "bpdTotalDistributed",
            "docs": [
              "Total tokens distributed via BPD"
            ],
            "type": "u64"
          },
          {
            "name": "totalEligible",
            "docs": [
              "Total number of eligible addresses in snapshot"
            ],
            "type": "u32"
          },
          {
            "name": "bump",
            "docs": [
              "PDA bump seed"
            ],
            "type": "u8"
          },
          {
            "name": "bpdRemainingUnclaimed",
            "docs": [
              "Remaining unclaimed amount for BPD distribution (tracks across batches)",
              "Set on first trigger_big_pay_day call, decremented with each batch"
            ],
            "type": "u64"
          },
          {
            "name": "bpdTotalShareDays",
            "docs": [
              "Total share-days accumulated across all BPD batches (for consistent rate calculation)",
              "Stored as u128 to prevent overflow with large stake counts"
            ],
            "type": "u128"
          },
          {
            "name": "bpdHelixPerShareDay",
            "docs": [
              "Pre-calculated BPD rate (Phase 3.2)"
            ],
            "type": "u128"
          },
          {
            "name": "bpdCalculationComplete",
            "docs": [
              "True once finalize_bpd_calculation has processed all stakes"
            ],
            "type": "bool"
          },
          {
            "name": "bpdSnapshotSlot",
            "docs": [
              "Slot pinned on first finalize batch for consistent days_staked calculation (Phase 3.3)"
            ],
            "type": "u64"
          },
          {
            "name": "bpdStakesFinalized",
            "docs": [
              "Count of unique stakes processed during finalize_bpd_calculation (Phase 3.3)"
            ],
            "type": "u32"
          },
          {
            "name": "bpdStakesDistributed",
            "docs": [
              "Count of unique stakes distributed to during trigger_big_pay_day (Phase 3.3)"
            ],
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "claimPeriodEnded",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "slot",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "claimPeriodId",
            "type": "u32"
          },
          {
            "name": "totalClaimed",
            "type": "u64"
          },
          {
            "name": "claimsCount",
            "type": "u32"
          },
          {
            "name": "unclaimedAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "claimPeriodStarted",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "slot",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "claimPeriodId",
            "type": "u32"
          },
          {
            "name": "merkleRoot",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "totalClaimable",
            "type": "u64"
          },
          {
            "name": "totalEligible",
            "type": "u32"
          },
          {
            "name": "claimDeadlineSlot",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "claimStatus",
      "docs": [
        "Per-user claim status tracking",
        "Seeds: [b\"claim_status\", merkle_root[0..8], snapshot_wallet]",
        "Note: Uses 8-byte merkle prefix to allow future claim periods while preventing collisions"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isClaimed",
            "docs": [
              "True if user has claimed"
            ],
            "type": "bool"
          },
          {
            "name": "claimedAmount",
            "docs": [
              "Amount claimed (base + bonus, before vesting split)"
            ],
            "type": "u64"
          },
          {
            "name": "claimedSlot",
            "docs": [
              "Slot when claim was made"
            ],
            "type": "u64"
          },
          {
            "name": "bonusBps",
            "docs": [
              "Speed bonus applied (in bps: 0, 1000, or 2000)"
            ],
            "type": "u16"
          },
          {
            "name": "withdrawnAmount",
            "docs": [
              "Cumulative amount withdrawn from vesting (security: prevents double-withdrawal)"
            ],
            "type": "u64"
          },
          {
            "name": "vestingEndSlot",
            "docs": [
              "Slot when vesting completes (claimed_slot + 30 days)"
            ],
            "type": "u64"
          },
          {
            "name": "snapshotWallet",
            "docs": [
              "Original snapshot wallet (for verification)"
            ],
            "type": "pubkey"
          },
          {
            "name": "bump",
            "docs": [
              "PDA bump seed"
            ],
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "globalState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "docs": [
              "Authority that can update protocol parameters (future governance)"
            ],
            "type": "pubkey"
          },
          {
            "name": "mint",
            "docs": [
              "HELIX token mint address"
            ],
            "type": "pubkey"
          },
          {
            "name": "mintAuthorityBump",
            "docs": [
              "Bump seed for mint authority PDA"
            ],
            "type": "u8"
          },
          {
            "name": "bump",
            "docs": [
              "Bump seed for GlobalState PDA"
            ],
            "type": "u8"
          },
          {
            "name": "annualInflationBp",
            "docs": [
              "Annual inflation rate in basis points (3,690,000 = 3.69%)"
            ],
            "type": "u64"
          },
          {
            "name": "minStakeAmount",
            "docs": [
              "Minimum stake amount in token base units (10,000,000 = 0.1 HELIX)"
            ],
            "type": "u64"
          },
          {
            "name": "shareRate",
            "docs": [
              "Share rate: tokens per share (10,000 = 1:1 at launch). Increases over time."
            ],
            "type": "u64"
          },
          {
            "name": "startingShareRate",
            "docs": [
              "Starting share rate for reference"
            ],
            "type": "u64"
          },
          {
            "name": "slotsPerDay",
            "docs": [
              "Slots per logical day (~216,000 at 400ms/slot)"
            ],
            "type": "u64"
          },
          {
            "name": "claimPeriodDays",
            "docs": [
              "Claim period length in days"
            ],
            "type": "u8"
          },
          {
            "name": "initSlot",
            "docs": [
              "Slot when protocol was initialized"
            ],
            "type": "u64"
          },
          {
            "name": "totalStakesCreated",
            "docs": [
              "Total number of stakes ever created (monotonically increasing)"
            ],
            "type": "u64"
          },
          {
            "name": "totalUnstakesCreated",
            "docs": [
              "Total number of unstakes ever created (monotonically increasing)"
            ],
            "type": "u64"
          },
          {
            "name": "totalClaimsCreated",
            "docs": [
              "Total number of reward claims ever created (monotonically increasing)"
            ],
            "type": "u64"
          },
          {
            "name": "totalTokensStaked",
            "docs": [
              "Total tokens currently staked"
            ],
            "type": "u64"
          },
          {
            "name": "totalTokensUnstaked",
            "docs": [
              "Total tokens ever unstaked"
            ],
            "type": "u64"
          },
          {
            "name": "totalShares",
            "docs": [
              "Total active T-shares"
            ],
            "type": "u64"
          },
          {
            "name": "currentDay",
            "docs": [
              "Current distribution day number"
            ],
            "type": "u64"
          },
          {
            "name": "totalAdminMinted",
            "docs": [
              "Total tokens minted via admin_mint"
            ],
            "type": "u64"
          },
          {
            "name": "maxAdminMint",
            "docs": [
              "Maximum allowed admin mints (set at initialize)"
            ],
            "type": "u64"
          },
          {
            "name": "reserved",
            "type": {
              "array": [
                "u64",
                6
              ]
            }
          }
        ]
      }
    },
    {
      "name": "inflationDistributed",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "slot",
            "type": "u64"
          },
          {
            "name": "day",
            "type": "u64"
          },
          {
            "name": "daysElapsed",
            "type": "u64"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "newShareRate",
            "type": "u64"
          },
          {
            "name": "totalShares",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "initializeParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "annualInflationBp",
            "type": "u64"
          },
          {
            "name": "minStakeAmount",
            "type": "u64"
          },
          {
            "name": "startingShareRate",
            "type": "u64"
          },
          {
            "name": "slotsPerDay",
            "type": "u64"
          },
          {
            "name": "claimPeriodDays",
            "type": "u8"
          },
          {
            "name": "maxAdminMint",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "protocolInitialized",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "slot",
            "type": "u64"
          },
          {
            "name": "globalState",
            "type": "pubkey"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "mintAuthority",
            "type": "pubkey"
          },
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "annualInflationBp",
            "type": "u64"
          },
          {
            "name": "minStakeAmount",
            "type": "u64"
          },
          {
            "name": "startingShareRate",
            "type": "u64"
          },
          {
            "name": "slotsPerDay",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "rewardsClaimed",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "slot",
            "type": "u64"
          },
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "stakeId",
            "type": "u64"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "stakeAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "docs": [
              "Stake owner"
            ],
            "type": "pubkey"
          },
          {
            "name": "stakeId",
            "docs": [
              "Unique stake ID (from GlobalState counter)"
            ],
            "type": "u64"
          },
          {
            "name": "stakedAmount",
            "docs": [
              "Tokens staked (base units, 8 decimals)"
            ],
            "type": "u64"
          },
          {
            "name": "tShares",
            "docs": [
              "T-shares earned (includes LPB + BPB bonuses, scaled by PRECISION)"
            ],
            "type": "u64"
          },
          {
            "name": "startSlot",
            "docs": [
              "Slot when stake was created"
            ],
            "type": "u64"
          },
          {
            "name": "endSlot",
            "docs": [
              "Slot when stake matures (start + duration_days * slots_per_day)"
            ],
            "type": "u64"
          },
          {
            "name": "stakeDays",
            "docs": [
              "Committed duration in days (1-5555)"
            ],
            "type": "u16"
          },
          {
            "name": "rewardDebt",
            "docs": [
              "Reward debt for lazy distribution (t_shares * share_rate at creation/last claim)"
            ],
            "type": "u64"
          },
          {
            "name": "isActive",
            "docs": [
              "True if stake is active (false after unstake)"
            ],
            "type": "bool"
          },
          {
            "name": "bump",
            "docs": [
              "PDA bump seed"
            ],
            "type": "u8"
          },
          {
            "name": "bpdBonusPending",
            "docs": [
              "Big Pay Day bonus pending (set by trigger_big_pay_day, claimed via claim_rewards)"
            ],
            "type": "u64"
          },
          {
            "name": "bpdEligible",
            "docs": [
              "DEPRECATED: Set by create_stake but never checked by finalize/trigger. Kept for layout compatibility."
            ],
            "type": "bool"
          },
          {
            "name": "claimPeriodStartSlot",
            "docs": [
              "DEPRECATED: Set by create_stake but never read. BPD uses slot range checks. Kept for layout compatibility."
            ],
            "type": "u64"
          },
          {
            "name": "bpdClaimPeriodId",
            "docs": [
              "Last claim period that received BPD (0 = never, periods start at 1)"
            ],
            "type": "u32"
          },
          {
            "name": "bpdFinalizePeriodId",
            "docs": [
              "Last claim period where stake was counted in BPD finalize (0 = never)"
            ],
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "stakeCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "slot",
            "type": "u64"
          },
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "stakeId",
            "type": "u64"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "tShares",
            "type": "u64"
          },
          {
            "name": "days",
            "type": "u16"
          },
          {
            "name": "shareRate",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "stakeEnded",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "slot",
            "type": "u64"
          },
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "stakeId",
            "type": "u64"
          },
          {
            "name": "originalAmount",
            "type": "u64"
          },
          {
            "name": "returnAmount",
            "type": "u64"
          },
          {
            "name": "penaltyAmount",
            "type": "u64"
          },
          {
            "name": "penaltyType",
            "type": "u8"
          },
          {
            "name": "rewardsClaimed",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "tokensClaimed",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "slot",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "claimer",
            "type": "pubkey"
          },
          {
            "name": "snapshotWallet",
            "type": "pubkey"
          },
          {
            "name": "claimPeriodId",
            "type": "u32"
          },
          {
            "name": "snapshotBalance",
            "type": "u64"
          },
          {
            "name": "baseAmount",
            "type": "u64"
          },
          {
            "name": "bonusBps",
            "type": "u16"
          },
          {
            "name": "daysElapsed",
            "type": "u16"
          },
          {
            "name": "totalAmount",
            "type": "u64"
          },
          {
            "name": "immediateAmount",
            "type": "u64"
          },
          {
            "name": "vestingAmount",
            "type": "u64"
          },
          {
            "name": "vestingEndSlot",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "vestedTokensWithdrawn",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "slot",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "claimer",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "totalVested",
            "type": "u64"
          },
          {
            "name": "totalWithdrawn",
            "type": "u64"
          },
          {
            "name": "remaining",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
