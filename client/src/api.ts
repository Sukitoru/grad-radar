import { getAuthToken } from './authSession';

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? '/api';

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
  waitlistUntilTermId: string | null;
  waitlistUntilTerm?: Term | null;
}

export interface DecisionInput {
  status: Decision['status'];
  decisionDate: string;
  waitlistUntilTermId: string | null;
}

export interface RecentDecision extends Decision {
  createdAt: string;
  application: {
    gpa: number | string | null;
    researchArea: string | null;
    awards: string[];
    publications: number;
    comments: string | null;
    school: Pick<School, 'name'>;
    program: Pick<Program, 'name' | 'degreeLevel'>;
    term: Pick<Term, 'name' | 'academicYear'>;
  };
}

export interface Application {
  id: string;
  userId: string;
  schoolId: string;
  programId: string;
  termId: string;
  gpa: number | string | null;
  researchArea: string | null;
  awards: string[];
  publications: number;
  comments: string | null;
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
  awards: string[];
  publications: number;
  comments: string | null;
  submissionDate: string | null;
}

export interface ApplicationFilters {
  schoolId?: string;
  programId?: string;
  termId?: string;
  decisionStatus?: 'ACCEPTED' | 'REJECTED' | 'WAITLISTED' | 'PENDING';
}

export interface UserProfile {
  id: string;
  username: string;
  defaultGpa: number | string | null;
  defaultAwards: string[];
  defaultPublications: number;
}

export interface UserProfileInput {
  username: string;
  defaultGpa: number | null;
  defaultAwards: string[];
  defaultPublications: number;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    username: string;
  };
}

export const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  return error instanceof Error && error.message
    ? error.message
    : fallbackMessage;
};

async function apiRequest<ResponseType>(path: string, options?: RequestInit) {
  const headers = new Headers(options?.headers);
  const authToken = getAuthToken();

  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorResponse = (await response.json().catch(() => ({}))) as ApiErrorResponse;
    throw new Error(
      errorResponse.message ?? errorResponse.error ?? 'The request failed.',
    );
  }

  if (response.status === 204) {
    return undefined as ResponseType;
  }

  return response.json() as Promise<ResponseType>;
}

export const registerAccount = (credentials: AuthCredentials) =>
  apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

export const loginAccount = (credentials: AuthCredentials) =>
  apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

export const changeAccountPassword = (
  currentPassword: string,
  newPassword: string,
) =>
  apiRequest<{ message: string }>('/auth/password', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentPassword, newPassword }),
  });

export const getSchools = () => apiRequest<School[]>('/schools');

export const getPrograms = () => apiRequest<Program[]>('/programs');

export const getTerms = () => apiRequest<Term[]>('/terms');

export const getApplications = (filters: ApplicationFilters = {}) => {
  const searchParameters = new URLSearchParams();

  Object.entries(filters).forEach(([name, value]) => {
    if (value) {
      searchParameters.set(name, value);
    }
  });

  const queryString = searchParameters.toString();
  const path = queryString ? `/applications?${queryString}` : '/applications';

  return apiRequest<Application[]>(path);
};

export const getUserProfile = (userId: string) =>
  apiRequest<UserProfile>(`/users/${userId}/profile`);

export const getRecentDecisions = () =>
  apiRequest<RecentDecision[]>('/decisions/recent');

export const updateApplicationDecision = (
  applicationId: string,
  decision: DecisionInput,
) =>
  apiRequest<Decision>(`/applications/${applicationId}/decision`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(decision),
  });

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

export const updateUserProfile = (userId: string, profile: UserProfileInput) =>
  apiRequest<UserProfile>(`/users/${userId}/profile`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });
