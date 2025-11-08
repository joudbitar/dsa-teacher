// HTTP client for API requests

export interface HttpResponse<T = any> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
}

/**
 * POST request to API endpoint
 * @param url - Full URL to POST to
 * @param body - Request body object (will be JSON stringified)
 * @param headers - Optional headers object
 * @returns Promise with response object
 */
export async function post<T = any>(
  url: string,
  body: object,
  headers?: Record<string, string>
): Promise<HttpResponse<T>> {
  try {
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(body),
    });

    const status = response.status;
    const ok = response.ok; // true if status is 200-299

    // Try to parse JSON response
    let data: T | undefined;
    let error: string | undefined;

    try {
      const text = await response.text();
      if (text) {
        data = JSON.parse(text) as T;
      }
    } catch (parseError) {
      // If JSON parsing fails, use status text as error
      if (!ok) {
        error = response.statusText || `HTTP ${status}`;
      }
    }

    // If request failed, set error message
    if (!ok) {
      // Check if data is an object with error or message properties
      const dataObj = data as any;
      error = 
        (dataObj && typeof dataObj === 'object' && (dataObj.error || dataObj.message)) ||
        response.statusText ||
        `HTTP ${status}`;
    }

    return {
      ok,
      status,
      data,
      error,
    };
  } catch (networkError) {
    // Handle network errors (no internet, DNS failure, timeout, etc.)
    const errorMessage =
      networkError instanceof Error
        ? networkError.message
        : 'Failed to connect to API. Check your internet connection.';

    return {
      ok: false,
      status: 0,
      error: errorMessage,
    };
  }
}
