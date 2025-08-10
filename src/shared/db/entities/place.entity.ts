import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Define a type for the rules structure
export type Rule = {
	text: string;
	icon: string;
};

@Entity()
export class Place {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'varchar', length: 255 })
	name: string;

	// We'll store the coordinates as a Point for spatial queries.
	// The SRID 4326 is standard for latitude and longitude.
	@Column('geography')
	coordinates: { type: string; coordinates: [number, number] };

	@Column({ type: 'text' }) // Use 'text' for longer descriptions
	description: string;

	@Column({ nullable: true, type: 'varchar' })
	photoUrl: string;

	@Column({ type: 'varchar', nullable: true })
	category: string;

	// New columns from your dataset
	@Column({ type: 'varchar', nullable: true })
	region: string;

	@Column('varchar', { array: true, nullable: true })
	historicalInterests: string[];

	@Column({ type: 'varchar', nullable: true })
	sitePreference: string;

	@Column({ type: 'varchar', nullable: true })
	suggestedTime: string;

	@Column('varchar', { array: true, nullable: true })
	pace: string[];

	@Column('varchar', { array: true, nullable: true })
	activities: string[];

	@Column('varchar', { array: true, nullable: true })
	explorationStyle: string[];

	@Column('varchar', { array: true, nullable: true })
	budget: string[];

	@Column('varchar', { array: true, nullable: true })
	mobility: string[];

	@Column('varchar', { array: true, nullable: true })
	culturalExperiences: string[];

	@Column('varchar', { array: true, nullable: true })
	specialRequests: string[];

	@Column({ type: 'text', nullable: true })
	briefHistory: string;

	@Column('jsonb', { nullable: true })
	rules: Rule[];
}
