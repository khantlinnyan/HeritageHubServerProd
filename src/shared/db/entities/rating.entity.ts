import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';
import { Itinerary } from './itinerary.entity';
import { User } from './user.entitiy';

@Entity()
@Index(['user', 'itinerary'], { unique: true })
export class Rating {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'int', default: 0 })
	value: number;

	@ManyToOne(() => User)
	user: User;

	@ManyToOne(() => Itinerary, (itinerary) => itinerary.ratings, { onDelete: 'CASCADE' })
	itinerary: Itinerary;

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	createdAt: Date;
}
