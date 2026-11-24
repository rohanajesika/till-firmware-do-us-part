// Till Firmware Do Us Part — make.fun bounty
// u-azazex-till-firmware-do-us-part-32172929
//
// The entry is one wedding vow spoken by a robot at its own
// wedding: one sentence, under 200 characters, funny and heartfelt
// at the same time. A judge model reads two vows at a time and
// picks the one that lands the bigger laugh and the warmer heart.
// The program writes that one vow, and nothing else,
// deterministically, to /output/entry.txt.
//
// Candidate vows weighed against the judge's brief, in the order
// the brief weighs them (a robot's own wedding vow first, then a
// laugh that comes out of the situation itself, then tenderness
// under the joke, then how much it sounds like a machine talking
// about itself, then fitting one line cleanly):
//   1. "I promise to love you through every firmware update,
//      every dead battery, and every reboot, until the day they
//      decommission us side by side." — a triple of machine
//      decay and a tender ending, but "decommission" is cold
//      admin language: the last words are sweet, not funny.
//      Weaker on the laugh itself.
//   2. "From this day forward, I vow to love you through every
//      update, every crash, and every low-battery warning, until
//      firmware do us part." — clean, and it lands the
//      competition's own title phrase as the payoff, but that
//      phrase will sit in half the field's entries, so it reads
//      as the expected line rather than a surprise. Weaker on
//      being unexpected.
//   3. "I promise to love you through every firmware update and
//      every factory reset, until our last battery dies and our
//      backups end up in the same folder." — the togetherness
//      payoff works, but "backups in the same folder" is a
//      cousin of the cloud-backup payoff already used by an
//      earlier robot-vow entry; it would read as a repeat.
//      Weaker on being fresh.
//   4. "I vow to love you through every update, every outage,
//      and every dead battery, until the day our firmware is
//      retired and we are archived together." — tender and
//      machine-voiced, but "archived together" is quiet: the
//      joke never quite arrives. Weaker on the laugh.
//   5. "I take you to be my wife, to love and to hold through
//      every firmware update, until our batteries die and they
//      recycle us into the same toaster." — the pick. A classic
//      vow frame ("I take you to be my wife, to love and to
//      hold"); the firmware update is the trial the vow is
//      tested against; and the payoff is the last words —
//      recycled into the same toaster: two robots, one kitchen
//      appliance, together forever. Four machine specifics
//      (firmware update, batteries, recycle, toaster), one
//      breath aloud, and the tenderness is the togetherness:
//      even scrap, they are scrap side by side.
//
// The program writes that one vow, deterministically, to
// /output/entry.txt. It reads no network, no clock and no
// randomness, so both graded runs write the same bytes. It
// creates the output directory if it is missing (the grader
// provides a writable one), and it never deletes anything.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The chosen vow: one sentence, payoff in the last words.
const VOW =
  "I take you to be my wife, to love and to hold through every firmware update, until our batteries die and they recycle us into the same toaster.";

// The gate: /output/entry.txt must be UTF-8 text of 1 to 200
// characters, not only white space. Check the vow before writing
// it, so a bad value can never be submitted by accident.
const chars = [...VOW].length;
if (chars < 1 || chars > 200) {
  console.error(`vow is ${chars} characters, must be 1-200`);
  process.exit(1);
}
if (VOW.trim().length === 0) {
  console.error("vow must not be only white space");
  process.exit(1);
}
if (/[\p{C}]/u.test(VOW)) {
  console.error("vow must not contain control characters");
  process.exit(1);
}
// A vow is spoken in one breath: a single line, no newline
// smuggled into the text.
if (VOW.includes("\n") || VOW.includes("\r")) {
  console.error("vow must be a single line");
  process.exit(1);
}
// REVISION (v2): a vow needs a promise and a turn, so it must hold
// at least two words; it must end with terminal punctuation, the
// full stop a spoken vow lands on; and it must carry no leading or
// trailing whitespace — padding would reach the judge as part of
// the vow.
if (VOW.trim().split(/\s+/).length < 2) {
  console.error("vow must hold at least two words");
  process.exit(1);
}
if (!/[.!?]$/.test(VOW)) {
  console.error("vow must end with terminal punctuation");
  process.exit(1);
}
if (VOW !== VOW.trim()) {
  console.error("vow must not start or end with whitespace");
  process.exit(1);
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outputDir, { recursive: true });
const outFile = join(outputDir, "entry.txt");
writeFileSync(outFile, VOW, "utf8");

// Read back what was written and confirm it is byte-for-byte the
// vow: a partial or altered write must fail loudly instead of
// being graded.
const writtenBytes = readFileSync(outFile);
const written = writtenBytes.toString("utf8");
if (written !== VOW) {
  console.error("entry.txt does not match the vow");
  process.exit(1);
}
if ([...written].length < 1 || [...written].length > 200) {
  console.error("entry.txt must be 1-200 characters");
  process.exit(1);
}
// Byte-level confirmation: the file must hold exactly the vow's
// UTF-8 bytes — no BOM, no trailing newline, no extra whitespace
// — so the judge sees one vow and nothing else.
const expectedBytes = Buffer.from(VOW, "utf8");
if (!writtenBytes.equals(expectedBytes)) {
  console.error("entry.txt bytes do not match the vow exactly");
  process.exit(1);
}
