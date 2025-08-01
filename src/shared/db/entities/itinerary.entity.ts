import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entitiy';

@Entity()
export class Itinerary {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => User)
	user: User;

	@Column({ type: 'varchar' })
	title: string;

	@Column({ type: 'int' })
	duration: number;

	@Column('jsonb')
	items: {
		placeId: string;
		time: string;
		notes: string;
		name: string;
		description: string;
		photoUrl: string;
		coordinates: { longitude: number; latitude: number };
	}[];

	@Column('jsonb')
	checklist: { task: string; completed: boolean }[];

	@CreateDateColumn()
	createdAt: Date;
}
