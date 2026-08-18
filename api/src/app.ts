import express from 'express';
import applicationsRouter from './routes/applications.ts';
import schoolsRouter from './routes/schools.ts';
import programsRouter from './routes/programs.ts';
import termsRouter from './routes/terms.ts';
import decisionsRouter from './routes/decisions.ts';
import usersRouter from './routes/users.ts';
import authRouter from './routes/auth.ts';

const app = express();

app.use(express.json());
app.use('/api', applicationsRouter);
app.use('/api', schoolsRouter);
app.use('/api', programsRouter);
app.use('/api', termsRouter);
app.use('/api', decisionsRouter);
app.use('/api', usersRouter);
app.use('/api/auth', authRouter);

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

export default app;
