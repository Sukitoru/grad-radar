export interface AuthenticatedUser {
  id: string;
  username: string;
}

const authTokenKey = 'auth_token';
const authenticatedUserKey = 'auth_user';
const requestedPathKey = 'requested_path';

export const saveAuthSession = (
  token: string,
  user: AuthenticatedUser,
) => {
  localStorage.setItem(authTokenKey, token);
  localStorage.setItem(authenticatedUserKey, JSON.stringify(user));
};

export const getAuthToken = () => localStorage.getItem(authTokenKey);

export const getAuthenticatedUser = () => {
  const savedUser = localStorage.getItem(authenticatedUserKey);

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser) as AuthenticatedUser;
  } catch {
    clearAuthSession();
    return null;
  }
};

export const isAuthenticated = () => {
  return Boolean(getAuthToken() && getAuthenticatedUser());
};

export const clearAuthSession = () => {
  localStorage.removeItem(authTokenKey);
  localStorage.removeItem(authenticatedUserKey);
};

export const rememberRequestedPath = (path: string) => {
  if (path !== '/login' && path !== '/signup') {
    sessionStorage.setItem(requestedPathKey, path);
  }
};

export const takeRequestedPath = () => {
  const requestedPath = sessionStorage.getItem(requestedPathKey);
  sessionStorage.removeItem(requestedPathKey);
  return requestedPath;
};
