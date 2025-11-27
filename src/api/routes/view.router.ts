import { RouterBroker } from '@api/abstract/abstract.router';
import express, { Router } from 'express';
import rateLimit from 'express-rate-limit';
import path from 'path';

// Rate limiter for static file serving - prevents DoS attacks
const viewRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

export class ViewsRouter extends RouterBroker {
  public readonly router: Router;

  constructor() {
    super();
    this.router = Router();

    const basePath = path.join(process.cwd(), 'manager', 'dist');
    const indexPath = path.join(basePath, 'index.html');

    this.router.use(viewRateLimiter);
    this.router.use(express.static(basePath));

    this.router.get('*', (_req, res) => {
      res.sendFile(indexPath);
    });
  }
}
