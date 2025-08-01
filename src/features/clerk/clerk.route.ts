import { Router } from 'express';
import express from 'express';
import bodyParser from 'body-parser';
import { clerkWebhookHandler } from './clerk.controller';

const router = Router();

router.post('/webhooks/clerk', bodyParser.raw({ type: 'application/json' }), clerkWebhookHandler);

export default router;
