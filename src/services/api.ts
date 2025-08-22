const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export interface User {
  _id?: string;
  clerkUserId: string;
  name: string;
  email: string;
  university?: string;
  major?: string;
  gpa?: number;
  phone?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
  resumePdf?: {
    filename: string;
    originalName: string;
    uploadDate: string;
  };
  parsedResumeData?: {
    rawText: string;
    extractedSkills: string[];
    extractedEducation: string[];
    extractedExperience: string[];
  };
  projects?: Project[];
  workExperiences?: WorkExperience[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  _id?: string;
  projectName: string;
  skills: string[];
  sampleBullets: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkExperience {
  _id?: string;
  company: string;
  position?: string;
  startDate?: string;
  endDate?: string;
  skills: string[];
  sampleBullets: string[];
  createdAt?: string;
  updatedAt?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Clerk-based user operations
  async getUserByClerkId(clerkUserId: string): Promise<User> {
    return this.request<User>(`/users/clerk/${clerkUserId}`);
  }

  async createUserWithClerk(userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return this.request<User>('/users/clerk', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUserByClerkId(clerkUserId: string, userData: Partial<User>): Promise<User> {
    return this.request<User>(`/users/clerk/${clerkUserId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Project operations
  async addProject(userId: string, project: Omit<Project, '_id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return this.request<User>(`/users/${userId}/projects`, {
      method: 'POST',
      body: JSON.stringify(project),
    });
  }

  async updateProject(userId: string, projectId: string, project: Partial<Project>): Promise<User> {
    return this.request<User>(`/users/${userId}/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(project),
    });
  }

  async deleteProject(userId: string, projectId: string): Promise<User> {
    return this.request<User>(`/users/${userId}/projects/${projectId}`, {
      method: 'DELETE',
    });
  }

  // Work experience operations
  async addWorkExperience(userId: string, experience: Omit<WorkExperience, '_id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return this.request<User>(`/users/${userId}/work-experiences`, {
      method: 'POST',
      body: JSON.stringify(experience),
    });
  }

  async updateWorkExperience(userId: string, experienceId: string, experience: Partial<WorkExperience>): Promise<User> {
    return this.request<User>(`/users/${userId}/work-experiences/${experienceId}`, {
      method: 'PUT',
      body: JSON.stringify(experience),
    });
  }

  async deleteWorkExperience(userId: string, experienceId: string): Promise<User> {
    return this.request<User>(`/users/${userId}/work-experiences/${experienceId}`, {
      method: 'DELETE',
    });
  }

  // Search operations
  async searchUsersBySkills(skills: string[]): Promise<User[]> {
    const skillsParam = skills.join(',');
    return this.request<User[]>(`/users/search/skills?skills=${encodeURIComponent(skillsParam)}`);
  }

  async getUsersByCompany(company: string): Promise<User[]> {
    return this.request<User[]>(`/users/company/${encodeURIComponent(company)}`);
  }

  // Resume operations
  async uploadResume(clerkUserId: string, file: File): Promise<any> {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('clerkUserId', clerkUserId);

    const response = await fetch(`${API_BASE_URL}/resume/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getResumeData(clerkUserId: string): Promise<any> {
    return this.request(`/resume/${clerkUserId}`);
  }

  // Application automation
  async automateApplication(clerkUserId: string, jobUrl: string): Promise<any> {
    return this.request('/application/automate', {
      method: 'POST',
      body: JSON.stringify({ clerkUserId, jobUrl }),
    });
  }

  async getApplicationStatus(applicationId: string): Promise<any> {
    return this.request(`/application/status/${applicationId}`);
  }
}

export const apiService = new ApiService(); 