import express from 'express';
import applicationsRouter from './routes/applications.ts';

const app = express();

app.use(express.json());
app.use('/api', applicationsRouter);

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

export default app;
