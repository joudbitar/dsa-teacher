// Parse test output into structured report
//
// Input:
//   stdout: string (raw test output)
//   language: string (to determine parser strategy)
//
// Output:
//   {
//     pass: boolean;
//     summary: string; // e.g., "5 passed, 0 failed"
//     details?: {
//       total: number;
//       passed: number;
//       failed: number;
//       failedTests?: string[];
//     };
//   }
//
// Implementation notes:
// - Jest/Vitest: look for "Tests: X passed, Y failed" or JSON reporter
// - pytest: parse "X passed" line or use --json flag
// - go test: parse "PASS" or "FAIL" and test counts
// - Fallback: if exitCode === 0, assume pass; else fail

