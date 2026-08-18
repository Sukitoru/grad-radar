export interface AuthenticatedUser {
  id: string;
  username: string;
}

const authTokenKey = 'auth_token';
const authenticatedUserKey = 'auth_user';

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
