export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export interface School {
  id: string;
  name: string;
}

export interface Program {
  id: string;
  schoolId: string;
  name: string;
  degreeLevel: 'Masters' | 'Doctoral';
}

export interface Term {
  id: string;
  name: string;
  academicYear: number;
}

export interface Decision {
  id: string;
  status: 'ACCEPTED' | 'REJECTED' | 'WAITLISTED';
  decisionDate: string;
}

export interface Application {
  id: string;
  userId: string;
  schoolId: string;
  programId: string;
  termId: string;
  gpa: number | null;
  researchArea: string | null;
  awards: string | null;
  publications: number;
  submissionDate: string | null;
  school?: School;
  program?: Program;
  term?: Term;
  decision?: Decision | null;
}

export interface ApplicationInput {
  userId?: string;
  schoolId: string;
  programId: string;
  termId: string;
  gpa: number | null;
  researchArea: string | null;
  awards: string | null;
  publications: number;
  submissionDate: string | null;
}

interface ApiErrorResponse {
  message?: string;
}

async function apiRequest<ResponseType>(path: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (!response.ok) {
    const errorResponse = (await response.json().catch(() => ({}))) as ApiErrorResponse;
    throw new Error(errorResponse.message ?? 'The request failed.');
  }

  if (response.status === 204) {
    return undefined as ResponseType;
  }

  return response.json() as Promise<ResponseType>;
}

export const getSchools = () => apiRequest<School[]>('/schools');

export const getPrograms = () => apiRequest<Program[]>('/programs');

export const getTerms = () => apiRequest<Term[]>('/terms');

export const getApplications = () => apiRequest<Application[]>('/applications');

export const createApplication = (application: ApplicationInput) =>
  apiRequest<Application>('/applications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(application),
  });

export const updateApplication = (id: string, application: ApplicationInput) =>
  apiRequest<Application>(`/applications/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(application),
  });

export const deleteApplication = (id: string) =>
  apiRequest<{ message: string }>(`/applications/${id}`, {
    method: 'DELETE',
  });
