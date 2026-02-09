/**
 * Playwright globalTeardown — kills the solana-test-validator started by
 * global-setup using the PID stored in the temp file.
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
    console.log("[global-teardown] No validator PID file found, skipping.");
  } finally {
    try {
      fs.unlinkSync(PID_FILE);
    } catch {
      // Already cleaned up
    }
  }
}
