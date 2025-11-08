// Git operations
//
// Function: checkStatus
// Input: cwd (string)
// Output:
//   {
//     clean: boolean; // true if no uncommitted changes
//     commitSha: string; // current HEAD commit
//   }
//
// Implementation notes:
// - Run `git status --porcelain` to check for changes
// - Run `git rev-parse HEAD` to get commit SHA
// - If not a git repo, return { clean: true, commitSha: 'unknown' }

