/**
 * Playwright globalTeardown — cleans up after E2E test runs.
 *
 * In the Docker-validator setup (Plan 09.1-02+), global-setup.ts does NOT
 * spawn a solana-test-validator and does NOT write a PID file.
 * The Docker validator runs independently and is left running after tests.
 *
 * If a PID file happens to exist (e.g., from a legacy run), this teardown
 * still handles it gracefully. Otherwise it logs and exits cleanly.
 */

import * as fs from "fs";
import * as os from "os";
import * as path from "path";

const PID_FILE = path.join(os.tmpdir(), "helix-e2e-validator.json");

export default async function globalTeardown() {
  try {
    const data = JSON.parse(fs.readFileSync(PID_FILE, "utf-8"));
    const pid = data.pid as number;
    console.log("[global-teardown] Killing validator PID", pid);
    process.kill(pid, "SIGTERM");
  } catch {
    // No PID file — Docker validator is not managed by Playwright. Skip silently.
    console.log("[global-teardown] No validator PID file — Docker validator left running.");
  } finally {
    try {
      fs.unlinkSync(PID_FILE);
    } catch {
      // Already cleaned up or never existed
    }
  }
}
