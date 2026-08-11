import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-gradradar-key';

// Extend Express Request interface to include user property
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
  };
}

/**
 * Express Middleware to verify JWT authentication token
 * Expects header: Authorization: Bearer <token>
 */
export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): any => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Access denied. No session token provided.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Decrypt and verify the payload using the secret key
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; username: string };
    
    // Attach user profile info directly to request context
    req.user = {
      id: decoded.id,
      username: decoded.username
    };

    next(); // Pass control to the next route handler
  } catch (error) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Session expired or token is invalid. Please sign in again.'
    });
  }
};
