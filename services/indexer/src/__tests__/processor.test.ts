import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock db client before importing processor
vi.mock('../db/client.js', () => {
  const insertChain = {
    values: vi.fn().mockReturnThis(),
    onConflictDoNothing: vi.fn().mockResolvedValue(undefined),
  };
  const selectChain = {
    from: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue([]),
    where: vi.fn().mockReturnThis(),
  };
  return {
    db: {
      insert: vi.fn().mockReturnValue(insertChain),
      select: vi.fn().mockReturnValue(selectChain),
      execute: vi.fn().mockResolvedValue({ rows: [] }),
    },
  };
});

// Mock notification scheduler
vi.mock('../worker/notification-scheduler.js', () => ({
  sendBpdTransitionNotification: vi.fn().mockResolvedValue(undefined),
  sendRewardsNotification: vi.fn().mockResolvedValue(undefined),
}));

// Mock logger
vi.mock('../lib/logger.js', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

import { processEvent } from '../worker/processor.js';
import { db } from '../db/client.js';

describe('processEvent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock chain return values
    const insertChain = {
      values: vi.fn().mockReturnThis(),
      onConflictDoNothing: vi.fn().mockResolvedValue(undefined),
    };
    vi.mocked(db.insert).mockReturnValue(insertChain as any);

    const selectChain = {
      from: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([]),
      where: vi.fn().mockReturnThis(),
    };
    vi.mocked(db.select).mockReturnValue(selectChain as any);
  });

  describe('ProtocolInitialized', () => {
    it('inserts protocol initialized event into db', async () => {
      const event = {
        name: 'ProtocolInitialized',
        data: {
          globalState: 'GlobalStatePubkey111111111111111111111111111',
          mint: 'MintPubkey111111111111111111111111111111111',
          mintAuthority: 'MintAuth111111111111111111111111111111111',
          authority: 'AuthPubkey111111111111111111111111111111111',
          annualInflationBp: { toString: () => '500' },
          minStakeAmount: { toString: () => '100000000' },
          startingShareRate: { toString: () => '1000000000' },
          slotsPerDay: { toString: () => '216000' },
        },
        slot: 100,
      };

      await processEvent(event, 'sig1');
      expect(db.insert).toHaveBeenCalled();
    });
  });

  describe('StakeCreated', () => {
    it('inserts stake created event with correct field mapping', async () => {
      const insertMock = {
        values: vi.fn().mockReturnThis(),
        onConflictDoNothing: vi.fn().mockResolvedValue(undefined),
      };
      vi.mocked(db.insert).mockReturnValue(insertMock as any);

      const event = {
        name: 'StakeCreated',
        data: {
          user: 'UserPubkey111111111111111111111111111111111',
          stakeId: { toNumber: () => 1 },
          amount: { toString: () => '1000000000' },
          tShares: { toString: () => '100000' },
          days: 365,
          shareRate: { toString: () => '1000000000' },
        },
        slot: 200,
      };

      await processEvent(event, 'sig2');
      expect(db.insert).toHaveBeenCalled();
      expect(insertMock.values).toHaveBeenCalledWith(
        expect.objectContaining({
          signature: 'sig2',
          slot: 200,
          user: 'UserPubkey111111111111111111111111111111111',
          stakeId: 1,
          amount: '1000000000',
          tShares: '100000',
          days: 365,
          shareRate: '1000000000',
        }),
      );
    });

    it('handles missing optional fields gracefully', async () => {
      const event = {
        name: 'StakeCreated',
        data: {
          user: 'UserPubkey111111111111111111111111111111111',
          stakeId: 0,
          amount: '0',
          tShares: '0',
          days: 1,
          shareRate: '0',
        },
        slot: 300,
      };

      await expect(processEvent(event, 'sig3')).resolves.toBeUndefined();
    });
  });

  describe('StakeEnded', () => {
    it('inserts stake ended event', async () => {
      const event = {
        name: 'StakeEnded',
        data: {
          user: 'UserPubkey111111111111111111111111111111111',
          stakeId: { toNumber: () => 1 },
          originalAmount: { toString: () => '1000000000' },
          returnAmount: { toString: () => '1100000000' },
          penaltyAmount: { toString: () => '0' },
          penaltyType: 0,
          rewardsClaimed: { toString: () => '100000000' },
        },
        slot: 400,
      };

      await processEvent(event, 'sig4');
      expect(db.insert).toHaveBeenCalled();
    });

    it('handles penalty on early unstake', async () => {
      const event = {
        name: 'StakeEnded',
        data: {
          user: 'UserPubkey111111111111111111111111111111111',
          stakeId: 2,
          originalAmount: '1000000000',
          returnAmount: '750000000',
          penaltyAmount: '250000000',
          penaltyType: 1,
          rewardsClaimed: '0',
        },
        slot: 401,
      };

      await expect(processEvent(event, 'sig5')).resolves.toBeUndefined();
    });
  });

  describe('RewardsClaimed', () => {
    it('inserts rewards claimed event', async () => {
      const event = {
        name: 'RewardsClaimed',
        data: {
          user: 'UserPubkey111111111111111111111111111111111',
          stakeId: 1,
          amount: '50000000',
        },
        slot: 500,
      };

      await processEvent(event, 'sig6');
      expect(db.insert).toHaveBeenCalled();
    });
  });

  describe('InflationDistributed', () => {
    it('inserts inflation distributed event and triggers rewards notification', async () => {
      const { sendRewardsNotification } = await import('../worker/notification-scheduler.js');
      const event = {
        name: 'InflationDistributed',
        data: {
          day: 1,
          daysElapsed: 1,
          amount: { toString: () => '10000000' },
          newShareRate: { toString: () => '1100000000' },
          totalShares: { toString: () => '5000000' },
        },
        slot: 600,
      };

      await processEvent(event, 'sig7');
      expect(db.insert).toHaveBeenCalled();
      // Fire-and-forget notification — function is called
      expect(sendRewardsNotification).toHaveBeenCalled();
    });
  });

  describe('BigPayDayDistributed', () => {
    it('inserts BPD distributed event and triggers BPD notification', async () => {
      const { sendBpdTransitionNotification } = await import('../worker/notification-scheduler.js');
      const event = {
        name: 'BigPayDayDistributed',
        data: {
          timestamp: 1700000000,
          claimPeriodId: 1,
          totalUnclaimed: { toString: () => '5000000000' },
          totalEligibleShareDays: { toString: () => '1000000' },
          helixPerShareDay: { toString: () => '5000' },
          eligibleStakers: 100,
        },
        slot: 700,
      };

      await processEvent(event, 'sig8');
      expect(db.insert).toHaveBeenCalled();
      expect(sendBpdTransitionNotification).toHaveBeenCalledWith('distribution_complete');
    });
  });

  describe('BpdBatchFinalized', () => {
    it('inserts BPD batch finalized event and triggers finalization notification', async () => {
      const { sendBpdTransitionNotification } = await import('../worker/notification-scheduler.js');
      const event = {
        name: 'BpdBatchFinalized',
        data: {
          claimPeriodId: 1,
          batchStakesProcessed: 50,
          totalStakesFinalized: 50,
          cumulativeShareDays: { toString: () => '500000' },
          timestamp: 1700000000,
        },
        slot: 800,
      };

      await processEvent(event, 'sig9');
      expect(db.insert).toHaveBeenCalled();
      expect(sendBpdTransitionNotification).toHaveBeenCalledWith('finalization_started');
    });
  });

  describe('BpdAborted', () => {
    it('inserts BPD aborted event', async () => {
      const event = {
        name: 'BpdAborted',
        data: {
          claimPeriodId: 1,
          stakesFinalized: 30,
          stakesDistributed: 25,
        },
        slot: 900,
      };

      await processEvent(event, 'sig10');
      expect(db.insert).toHaveBeenCalled();
    });
  });

  describe('AuthorityTransferInitiated', () => {
    it('inserts authority transfer initiated event', async () => {
      const event = {
        name: 'AuthorityTransferInitiated',
        data: {
          oldAuthority: 'OldAuth111111111111111111111111111111111111',
          newAuthority: 'NewAuth111111111111111111111111111111111111',
        },
        slot: 1000,
      };

      await processEvent(event, 'sig11');
      expect(db.insert).toHaveBeenCalled();
    });
  });

  describe('AuthorityTransferCancelled', () => {
    it('inserts authority transfer cancelled event', async () => {
      const event = {
        name: 'AuthorityTransferCancelled',
        data: {
          authority: 'Auth11111111111111111111111111111111111111',
          cancelledNewAuthority: 'NewAuth111111111111111111111111111111111111',
        },
        slot: 1001,
      };

      await processEvent(event, 'sig12');
      expect(db.insert).toHaveBeenCalled();
    });
  });

  describe('AuthorityTransferCompleted', () => {
    it('inserts authority transfer completed event', async () => {
      const event = {
        name: 'AuthorityTransferCompleted',
        data: {
          oldAuthority: 'OldAuth111111111111111111111111111111111111',
          newAuthority: 'NewAuth111111111111111111111111111111111111',
        },
        slot: 1002,
      };

      await processEvent(event, 'sig13');
      expect(db.insert).toHaveBeenCalled();
    });
  });

  describe('ReferralStaked', () => {
    it('inserts referral staked event', async () => {
      const event = {
        name: 'ReferralStaked',
        data: {
          referrer: 'RefPubkey111111111111111111111111111111111',
          referee: 'Referee111111111111111111111111111111111111',
          stakeId: 5,
          refereeTShareBonus: { toString: () => '10000' },
          referrerTokenBonus: { toString: () => '5000000' },
        },
        slot: 1100,
      };

      await processEvent(event, 'sig14');
      expect(db.insert).toHaveBeenCalled();
    });
  });

  describe('AdminMinted', () => {
    it('inserts admin minted event', async () => {
      const event = {
        name: 'AdminMinted',
        data: {
          authority: 'Auth11111111111111111111111111111111111111',
          recipient: 'Recipient111111111111111111111111111111111',
          amount: { toString: () => '1000000000' },
        },
        slot: 1200,
      };

      await processEvent(event, 'sig15');
      expect(db.insert).toHaveBeenCalled();
    });
  });

  describe('ClaimPeriodStarted', () => {
    it('inserts claim period started event', async () => {
      const event = {
        name: 'ClaimPeriodStarted',
        data: {
          timestamp: 1700000000,
          claimPeriodId: 1,
          merkleRoot: [1, 2, 3, 4],
          totalClaimable: { toString: () => '100000000000' },
          totalEligible: 500,
          claimDeadlineSlot: { toString: () => '2000000' },
        },
        slot: 1300,
      };

      await processEvent(event, 'sig16');
      expect(db.insert).toHaveBeenCalled();
    });
  });

  describe('TokensClaimed', () => {
    it('inserts tokens claimed event', async () => {
      const event = {
        name: 'TokensClaimed',
        data: {
          timestamp: 1700000000,
          claimer: 'Claimer111111111111111111111111111111111111',
          snapshotWallet: 'Snapshot1111111111111111111111111111111111',
          claimPeriodId: 1,
          snapshotBalance: { toString: () => '5000000000' },
          baseAmount: { toString: () => '1000000000' },
          bonusBps: 100,
          daysElapsed: 10,
          totalAmount: { toString: () => '1100000000' },
          immediateAmount: { toString: () => '550000000' },
          vestingAmount: { toString: () => '550000000' },
          vestingEndSlot: { toString: () => '3000000' },
        },
        slot: 1400,
      };

      await processEvent(event, 'sig17');
      expect(db.insert).toHaveBeenCalled();
    });
  });

  describe('VestedTokensWithdrawn', () => {
    it('inserts vested tokens withdrawn event', async () => {
      const event = {
        name: 'VestedTokensWithdrawn',
        data: {
          timestamp: 1700000000,
          claimer: 'Claimer111111111111111111111111111111111111',
          amount: { toString: () => '550000000' },
          totalVested: { toString: () => '550000000' },
          totalWithdrawn: { toString: () => '550000000' },
          remaining: { toString: () => '0' },
        },
        slot: 1500,
      };

      await processEvent(event, 'sig18');
      expect(db.insert).toHaveBeenCalled();
    });
  });

  describe('ClaimPeriodEnded', () => {
    it('inserts claim period ended event', async () => {
      const event = {
        name: 'ClaimPeriodEnded',
        data: {
          timestamp: 1700000000,
          claimPeriodId: 1,
          totalClaimed: { toString: () => '80000000000' },
          claimsCount: 400,
          unclaimedAmount: { toString: () => '20000000000' },
        },
        slot: 1600,
      };

      await processEvent(event, 'sig19');
      expect(db.insert).toHaveBeenCalled();
    });
  });

  describe('Unknown event type', () => {
    it('logs a warning and does not throw for unknown event types', async () => {
      const { logger } = await import('../lib/logger.js');
      const event = {
        name: 'UnknownFutureEvent',
        data: { foo: 'bar' },
        slot: 9999,
      };

      await expect(processEvent(event, 'sigUnknown')).resolves.toBeUndefined();
      expect(logger.warn).toHaveBeenCalledWith(
        expect.objectContaining({ eventName: 'UnknownFutureEvent' }),
        'Unknown event type, skipping',
      );
    });

    it('does not call db.insert for unknown event types', async () => {
      const event = {
        name: 'SomeUnknownEvent',
        data: {},
        slot: 10000,
      };

      await processEvent(event, 'sigUnknown2');
      expect(db.insert).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('catches and logs db errors without throwing', async () => {
      vi.mocked(db.insert).mockReturnValue({
        values: vi.fn().mockReturnThis(),
        onConflictDoNothing: vi.fn().mockRejectedValue(new Error('DB connection lost')),
      } as any);

      const event = {
        name: 'StakeCreated',
        data: {
          user: 'User111111111111111111111111111111111111111',
          stakeId: 99,
          amount: '1000000',
          tShares: '1000',
          days: 30,
          shareRate: '1000000000',
        },
        slot: 99999,
      };

      await expect(processEvent(event, 'sigErr')).resolves.toBeUndefined();
    });
  });

  describe('toStr helper edge cases', () => {
    it('handles null/undefined values in data fields', async () => {
      const event = {
        name: 'AdminMinted',
        data: {
          authority: null,
          recipient: undefined,
          amount: '0',
        },
        slot: 11111,
      };

      await expect(processEvent(event, 'sigNull')).resolves.toBeUndefined();
    });

    it('handles BN objects with toBase58 method', async () => {
      const event = {
        name: 'StakeCreated',
        data: {
          user: { toBase58: () => 'UserBase5811111111111111111111111111111111' },
          stakeId: { toNumber: () => 5 },
          amount: { toString: () => '500000000' },
          tShares: { toString: () => '50000' },
          days: 100,
          shareRate: { toString: () => '1000000000' },
        },
        slot: 22222,
      };

      await expect(processEvent(event, 'sigBN')).resolves.toBeUndefined();
    });

    it('handles array values (byte arrays like merkle root)', async () => {
      const event = {
        name: 'ClaimPeriodStarted',
        data: {
          timestamp: 1700000000,
          claimPeriodId: 2,
          merkleRoot: [0xde, 0xad, 0xbe, 0xef],
          totalClaimable: '100000',
          totalEligible: 10,
          claimDeadlineSlot: '9999999',
        },
        slot: 33333,
      };

      await expect(processEvent(event, 'sigBytes')).resolves.toBeUndefined();
    });
  });
});
