import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from './user.entitiy';
import { Rule } from './place.entity';
import { Rating } from './rating.entity';

export type ItineraryItem = {
	placeId: string;
	time: string;
	notes: string;
	name: string;
	description: string;
	photoUrl: string;
	coordinates: { longitude: number; latitude: number };
	region?: string;
	briefHistory?: string;
	rules?: Rule[];
	category?: string;
	suggestedTime?: string;
	pace?: string[];
	activities?: string[];
};

export type ItineraryDay = {
	day: number;
	items: ItineraryItem[];
};

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
	days: ItineraryDay[];

	@Column('jsonb')
	checklist: { task: string; completed: boolean }[];

	@CreateDateColumn()
	createdAt: Date;

	@Column({ default: false, type: 'boolean' })
	isPublic: boolean;

	@OneToMany(() => Rating, (rating) => rating.itinerary)
	ratings: Rating[];
}
