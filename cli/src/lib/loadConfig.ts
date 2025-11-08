// Load project configuration
//
// Input: cwd (string)
//
// Output: Config object
//   {
//     projectId: string;
//     moduleId: string;
//     language: string;
//     apiUrl: string;
//     authToken?: string;
//   }
//
// Steps:
// 1. Search for dsa.config.json in cwd and parent directories
// 2. Read and parse JSON
// 3. Validate required fields
// 4. Return config object
// 5. If not found, throw error: "Not a DSA project. Run this command inside a cloned challenge repo."

