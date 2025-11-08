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
  githubRepoUrl: string
  status: 'in_progress' | 'completed' | 'needs_config'
  progress: number
  currentChallengeIndex: number
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
      const error = await response
        .json()
        .catch(() => ({ error: response.statusText }))
      throw new Error(error.error || 'Failed to create project')
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
}

export const apiClient = new ApiClient(API_BASE_URL)

