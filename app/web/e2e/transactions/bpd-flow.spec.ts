/**
 * BPD (Big Pay Day) Flow E2E spec (TEST-06).
 *
 * Tests the BPD 3-phase flow: finalize -> seal -> distribute.
 *
 * The BPD status is visible on /dashboard/rewards via the BpdStatus component,
 * which shows one of these phases:
 *   - "Not Started" (claim period still active)
 *   - "Finalization In Progress" (finalize_bpd_calculation running)
 *   - "Awaiting Observation Window" (24h guard before seal)
 *   - "Ready for Distribution" (seal complete, distributable)
 *   - "Distribution In Progress" (trigger_big_pay_day running)
 *   - "Completed" (all stakes distributed)
 *
 * PRECONDITION NOTE:
 * A full BPD E2E test requires the following on-chain state to exist:
 *   1. Claim period initialized and ENDED (endSlot in the past)
 *   2. finalize_bpd_calculation called for all eligible stakes
 *   3. adminSetBpdFinalizeTimestamp backdated to bypass the 86400s seal guard
 *      (requires skipPreflight: true — authority-gated admin instruction)
 *   4. seal_bpd_finalize called to complete the seal
 *   5. trigger_big_pay_day crank to distribute to stakes
 *
 * Setting up this state in global-setup.ts is complex because:
 *   - adminSetClaimEndSlot has a floor guard (new_end_slot >= current + slotsPerDay)
 *   - After expiring the claim period, we must wait for natural slot advancement
 *   - adminSetBpdFinalizeTimestamp requires skipPreflight=true (admin clock quirk)
 *
 * This spec is therefore split into:
 *   1. UI rendering tests — always run, verify the BPD status page renders correctly
 *      in the "Not Started" phase (expected in the default test environment).
 *   2. Full BPD flow tests — skipped pending BPD_FLOW_READY=true env var, which
 *      should be set when global-setup.ts successfully completes BPD preconditions.
 *
 * To enable the full BPD flow test:
 *   a. Extend global-setup.ts with the BPD preparation block (see reference in
 *      .planning/phases/13-test-coverage/13-05-PLAN.md).
 *   b. Wrap it in try/catch and export process.env.BPD_FLOW_READY = 'true' on success.
 *   c. The skipped tests below will then execute.
 *
 * See: .planning/STATE.md — Key Decisions:
 *   - adminSetBpdFinalizeTimestamp bypasses 86400s wall-clock seal guard
 *   - skipPreflight=true required for admin Clock-reading instructions
 *   - adminSetClaimEndSlot floor guard: new_end_slot >= current+slotsPerDay+5
 */
import { test, expect, waitForWalletConnection } from "../fixtures";

test.describe("BPD Status Page — UI Rendering", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/rewards");
    await waitForWalletConnection(page);
    // Wait for the page heading to confirm navigation is complete
    await expect(page.getByRole("heading", { name: "Rewards", exact: true })).toBeVisible({
      timeout: 20_000,
    });
  });

  test("should render the Rewards page with BPD Status card", async ({ page }) => {
    // Rewards overview card — heading is exact, no false matches
    await expect(
      page.getByRole("heading", { name: "Rewards Overview", exact: true })
    ).toBeVisible({ timeout: 45_000 });
    // BPD Status card should be present
    await expect(
      page.getByRole("heading", { name: "Big Pay Day", exact: true })
    ).toBeVisible({ timeout: 10_000 });
  });

  test("should show BPD status badge on the status card", async ({ page }) => {
    // BPD card loads and shows a status badge
    await expect(
      page.getByRole("heading", { name: "Big Pay Day", exact: true })
    ).toBeVisible({ timeout: 45_000 });

    // The component shows one of these status badges depending on state
    const notStarted = page.getByText("Not Started");
    const finalization = page.getByText("Finalization In Progress");
    const observationWindow = page.getByText("Awaiting Observation Window");
    const readyForDist = page.getByText("Ready for Distribution");
    const distributing = page.getByText("Distribution In Progress");
    const completed = page.getByText("Completed");

    // At least one status badge must be visible
    await expect(
      notStarted
        .or(finalization)
        .or(observationWindow)
        .or(readyForDist)
        .or(distributing)
        .or(completed)
    ).toBeVisible({ timeout: 15_000 });
  });

  test("should show crank button on rewards page", async ({ page }) => {
    // CrankButton component renders "Daily Distribution" as a card title (h3)
    // Uses longer timeout since CrankButton waits for globalState to load from chain
    // Use exact heading role to avoid matching paragraph text containing "daily distributions"
    await expect(
      page.getByRole("heading", { name: "Daily Distribution", exact: true })
    ).toBeVisible({ timeout: 45_000 });
    // The button says "Trigger Daily Distribution" (or "Already Distributed Today" if already cranked)
    const crankBtn = page.getByRole("button", {
      name: /Trigger Daily Distribution|Already Distributed Today/i,
    });
    await expect(crankBtn).toBeVisible({ timeout: 15_000 });
  });
});

// ---------------------------------------------------------------------------
// BPD Phase 1: Finalize — skipped until BPD preconditions are set up
// ---------------------------------------------------------------------------

test.describe.serial("BPD Flow — Phase 1: Finalize", () => {
  test.skip(
    !process.env.BPD_FLOW_READY,
    "Skipped: requires BPD_FLOW_READY=true env var. " +
      "Extend global-setup.ts to expire the claim period and call " +
      "finalize_bpd_calculation for all eligible stakes. " +
      "The BPD status should show 'Finalization In Progress' or later phase."
  );

  test("should show finalization progress after claim period ends", async ({ page }) => {
    await page.goto("/dashboard/rewards");
    await waitForWalletConnection(page);

    await expect(page.locator("h1").filter({ hasText: "Rewards" })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("Big Pay Day")).toBeVisible({ timeout: 15_000 });

    // After claim period ends and finalize_bpd_calculation runs, expect either
    // finalization or a later phase (observation window, sealed, distributing, completed)
    const finalization = page.getByText("Finalization In Progress");
    const observationWindow = page.getByText("Awaiting Observation Window");
    const readyForDist = page.getByText("Ready for Distribution");
    const distributing = page.getByText("Distribution In Progress");
    const completed = page.getByText("Completed");

    await expect(
      finalization.or(observationWindow).or(readyForDist).or(distributing).or(completed)
    ).toBeVisible({ timeout: 20_000 });
  });
});

// ---------------------------------------------------------------------------
// BPD Phase 2: Seal — skipped until seal preconditions are met
// ---------------------------------------------------------------------------

test.describe.serial("BPD Flow — Phase 2: Seal", () => {
  test.skip(
    !process.env.BPD_SEAL_READY,
    "Skipped: requires BPD_SEAL_READY=true env var. " +
      "Extend global-setup.ts to call adminSetBpdFinalizeTimestamp (backdated) " +
      "and seal_bpd_finalize. " +
      "The BPD status should show 'Ready for Distribution'."
  );

  test("should show 'Ready for Distribution' after seal completes", async ({ page }) => {
    await page.goto("/dashboard/rewards");
    await waitForWalletConnection(page);

    await expect(page.locator("h1").filter({ hasText: "Rewards" })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("Big Pay Day")).toBeVisible({ timeout: 15_000 });
    // After seal, distribution should be ready
    const readyForDist = page.getByText("Ready for Distribution");
    const distributing = page.getByText("Distribution In Progress");
    const completed = page.getByText("Completed");

    await expect(readyForDist.or(distributing).or(completed)).toBeVisible({ timeout: 20_000 });
  });
});

// ---------------------------------------------------------------------------
// BPD Phase 3: Distribute — skipped until distribution preconditions are met
// ---------------------------------------------------------------------------

test.describe.serial("BPD Flow — Phase 3: Distribute", () => {
  test.skip(
    !process.env.BPD_DISTRIBUTE_READY,
    "Skipped: requires BPD_DISTRIBUTE_READY=true env var. " +
      "Extend global-setup.ts to complete seal and call trigger_big_pay_day for all " +
      "eligible stakes. The BPD status should show 'Completed'."
  );

  test("should show BPD Completed after distribution", async ({ page }) => {
    await page.goto("/dashboard/rewards");
    await waitForWalletConnection(page);

    await expect(page.locator("h1").filter({ hasText: "Rewards" })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("Big Pay Day")).toBeVisible({ timeout: 15_000 });
    // After full distribution, all stakes should show BPD Completed
    await expect(page.getByText("Completed")).toBeVisible({ timeout: 20_000 });

    // Stakes should now have bpdBonusPending reflected in their pending rewards
    // Navigate to dashboard to verify a stake shows increased rewards
    await page.goto("/dashboard");
    await waitForWalletConnection(page);
    await expect(page.getByText("Your Stakes")).toBeVisible({ timeout: 15_000 });
    // At minimum, a "Claim Rewards" action should be available (rewards accumulated)
    await expect(page.getByRole("link", { name: "Claim Rewards" }).first()).toBeVisible({
      timeout: 10_000,
    });
  });
});
