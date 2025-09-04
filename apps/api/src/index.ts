import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';

const app = express();
const allowedOrigins = (process.env.CORS_ORIGINS || '*').split(',');
app.use(cors({ origin: (origin, cb) => {
  if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
    return cb(null, true);
  }
  return cb(new Error('Not allowed by CORS'));
}, credentials: true }));
app.use(express.json());

const port = Number(process.env.PORT || 4000);

app.get('/health', (_req, res) => res.json({ ok: true }));

const server = app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});

const wss = new WebSocketServer({ server });
wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'hello', message: 'connected' }));
});
