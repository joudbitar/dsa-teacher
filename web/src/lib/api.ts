import { supabase } from './supabase'

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://mwlhxwbkuumjxpnvldli.supabase.co/functions/v1'

export interface Module {
  id: string
  title: string
  level: string
  summary: string
  subchallenges: string[]
  template: string
  languages: string[]
  time?: string
}

export interface Project {
  id: string
  userId: string
  moduleId: string
  language: string
  githubRepoUrl: string | null
  status: 'not_started' | 'in_progress' | 'completed'
  progress: number
  currentChallengeIndex: number
  projectToken: string
  createdAt: string
  updatedAt: string
}

export interface CreateProjectRequest {
  moduleId: string
  language: string
}

export interface CreateProjectResponse {
  id: string
  githubRepoUrl: string
  status: string
  progress: number
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async getHeaders(): Promise<HeadersInit> {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      throw new Error('No active session')
    }

    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    }
  }

  // GET /modules
  async getModules(): Promise<Module[]> {
    const response = await fetch(`${this.baseUrl}/modules`, {
      method: 'GET',
      headers: await this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch modules: ${response.statusText}`)
    }

    return response.json()
  }

  // GET /projects (optionally filtered by moduleId)
  async getProjects(moduleId?: string): Promise<Project[]> {
    const url = new URL(`${this.baseUrl}/projects`)
    if (moduleId) {
      url.searchParams.set('moduleId', moduleId)
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: await this.getHeaders(),
    })

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: response.statusText }))
      throw new Error(`Failed to fetch projects: ${error.error || response.statusText}`)
    }

    return response.json()
  }

  // POST /projects
  async createProject(
    data: CreateProjectRequest
  ): Promise<CreateProjectResponse> {
    const response = await fetch(`${this.baseUrl}/projects`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      let error: any;
      const contentType = response.headers.get('content-type');
      
      try {
        if (contentType && contentType.includes('application/json')) {
          error = await response.json();
        } else {
          const text = await response.text();
          error = { error: response.statusText, message: text || response.statusText };
        }
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError);
        error = { error: response.statusText, message: `HTTP ${response.status}: ${response.statusText}` };
      }
      
      // Log the full error for debugging
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        error,
      });
      
      // Create a more descriptive error message
      let errorMessage = error.error || error.message || 'Failed to create project';
      
      // Include hint if available
      if (error.hint) {
        errorMessage += `\n\nHint: ${error.hint}`;
      }
      
      // Include details if available
      if (error.details && error.details !== errorMessage) {
        errorMessage += `\n\nDetails: ${error.details}`;
      }
      
      const apiError = new Error(errorMessage);
      // Attach original error data for debugging
      (apiError as any).status = response.status;
      (apiError as any).originalError = error;
      throw apiError;
    }

    return response.json()
  }

  // GET /projects/:id (for single project details)
  async getProject(projectId: string): Promise<Project> {
    const response = await fetch(`${this.baseUrl}/projects/${projectId}`, {
      method: 'GET',
      headers: await this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch project: ${response.statusText}`)
    }

    return response.json()
  }

  // DELETE /projects/:id (restart a module by deleting the project)
  async deleteProject(projectId: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${this.baseUrl}/projects/${projectId}`, {
      method: 'DELETE',
      headers: await this.getHeaders(),
    })

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: response.statusText }))
      throw new Error(error.error || 'Failed to delete project')
    }

    return response.json()
  }
}

export const apiClient = new ApiClient(API_BASE_URL)

/**
 * Fetch user projects from the API
 * Uses Supabase auth session to get user ID and access token
 */
export async function fetchUserProjects(): Promise<Project[]> {
  try {
    // Get current session to extract user ID and access token
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      // User not authenticated, return empty array
      return []
    }

    const userId = session.user.id
    const accessToken = session.access_token

    // Fetch projects from API
    const headers: HeadersInit = {
      'x-user-id': userId,
      'Content-Type': 'application/json',
    }

    // Include auth token if available (for backend verification)
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    }

    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      console.error('Failed to fetch projects:', response.status, response.statusText)
      return []
    }

    const projects = await response.json()
    return projects as Project[]
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}

/**
 * Fetch a single project by moduleId
 */
export async function fetchProjectByModuleId(moduleId: string): Promise<Project | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return null
    }

    const userId = session.user.id
    const accessToken = session.access_token

    const headers: HeadersInit = {
      'x-user-id': userId,
      'Content-Type': 'application/json',
    }

    // Include auth token if available
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    }

    const response = await fetch(`${API_BASE_URL}/projects?moduleId=${encodeURIComponent(moduleId)}`, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      return null
    }

    const projects = await response.json()
    return (projects as Project[])[0] || null
  } catch (error) {
    console.error('Error fetching project:', error)
    return null
  }
}
