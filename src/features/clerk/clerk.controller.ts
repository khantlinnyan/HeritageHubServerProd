import { Request, Response } from 'express';
import { handleUserCreated, handleUserUpdated } from './clerk.service';
import { Webhook } from 'svix';

export const clerkWebhookHandler = async (req: Request, res: Response) => {
	try {
		const payload = req.body;
		const headers = req.headers;
		const secret = process.env.CLERK_WEBHOOK_SECRET;

		const wh = new Webhook(secret);

		const evt = wh.verify(payload, headers);
		const eventType = evt.type;
		const data = evt.data;

		console.log('Received Clerk event:', eventType);

		if (eventType === 'user.created') {
			const email = data.email_addresses[0].email_address;
			const clerkUserId = data.id;
			await handleUserCreated(clerkUserId, email);
		}

		if (eventType === 'user.updated') {
			const email = data.email_addresses[0].email_address;
			const clerkUserId = data.id;
			await handleUserUpdated(clerkUserId, email);
		}

		res.status(200).send('ok');
	} catch (err) {
		console.error('Webhook verification failed:', err);
		res.status(400).send('Invalid webhook');
	}
};
