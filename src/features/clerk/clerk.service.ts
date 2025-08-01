import { userRepo } from '../../shared/common/repo';

export const handleUserCreated = async (clerkUserId: string, email: string) => {
	let user = await userRepo.findOne({ where: { clerkUserId } });
	if (!user) {
		user = userRepo.create({ clerkUserId, email });
		await userRepo.save(user);
		console.log(`User created: ${email}`);
	}
};

export const handleUserUpdated = async (clerkUserId: string, email: string) => {
	const user = await userRepo.findOne({ where: { clerkUserId } });

	if (user) {
		user.email = email;
		await userRepo.save(user);
		console.log(`User updated: ${email}`);
	}
};
