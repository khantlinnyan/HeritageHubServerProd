import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Itinerary } from './itinerary.entity';

@Entity()
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true, type: 'varchar', length: 255, nullable: true })
	clerkUserId: string;

	@Column({ type: 'varchar', length: 255, nullable: true })
	email: string;

	@OneToMany(() => Itinerary, (itinerary) => itinerary.user, {
		onDelete: 'CASCADE'
	})
	itineraries: Itinerary[];
}
