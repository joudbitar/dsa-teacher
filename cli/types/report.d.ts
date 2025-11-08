// Test report type definitions

export interface TestReport {
  pass: boolean;
  summary: string;
  details?: {
    total: number;
    passed: number;
    failed: number;
    failedTests?: string[];
  };
}

export interface SubmissionRequest {
  projectId: string;
  result: 'pass' | 'fail';
  summary: string;
  details?: object;
  commitSha?: string;
}

export interface ProjectConfig {
  projectId: string;
  moduleId: string;
  language: string;
  apiUrl: string;
  authToken?: string;
}

