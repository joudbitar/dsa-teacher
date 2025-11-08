// HTTP client for API requests
//
// Function: post
// Input:
//   url: string
//   body: object
//   headers?: object
//
// Output:
//   {
//     ok: boolean;
//     status: number;
//     data?: any;
//     error?: string;
//   }
//
// Implementation notes:
// - Use fetch API (Node 18+ native)
// - Set Content-Type: application/json
// - Include Authorization header if provided
// - Handle network errors gracefully
// - Parse JSON response

