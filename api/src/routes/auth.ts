import express from 'express';

const authRouter = express.Router();

// Temporary endpoints until the authentication logic is added.
// Jalil, replace 501 handlers with passport/JWT logic from auth workshop.

authRouter.post('/register', (_request, response) => {
  response.status(501).json({
    message: 'Registration is in development.',
  });
});

authRouter.post('/login', (_request, response) => {
  response.status(501).json({
    message: 'Login is in development.',
  });
});

authRouter.get('/me', (_request, response) => {
  response.status(501).json({
    message: 'Current user lookup is in development.',
  });
});

authRouter.post('/logout', (_request, response) => {
  response.status(501).json({
    message: 'Logout is in development.',
  });
});

export default authRouter;
