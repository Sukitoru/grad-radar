import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface AuthTokenPayload {
  id: string;
  username: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
}

const jwtSecret = process.env.JWT_SECRET ?? 'grad-radar-local-demo-secret';

export const requireAuth = (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction,
) => {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader?.startsWith('Bearer ')) {
    response.status(401).json({ message: 'Log in to continue.' });
    return;
  }

  const token = authorizationHeader.slice('Bearer '.length);

  try {
    request.user = jwt.verify(token, jwtSecret) as AuthTokenPayload;
    next();
  } catch {
    response.status(401).json({
      message: 'Your session is invalid or expired. Please log in again.',
    });
  }
};
