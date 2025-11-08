// Execute shell command
//
// Input:
//   command: string (e.g., "npm test")
//   cwd: string (working directory)
//
// Output:
//   {
//     stdout: string;
//     stderr: string;
//     exitCode: number;
//   }
//
// Implementation notes:
// - Use Node child_process.spawn or execa
// - Capture stdout and stderr
// - Return exit code
// - Stream output to terminal in real-time (optional for better UX)

