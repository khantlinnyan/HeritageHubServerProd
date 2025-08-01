import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Place {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'varchar', length: 255 })
	name: string;

	@Column('geography', { spatialFeatureType: 'Point', srid: 4326, nullable: true })
	coordinates: { type: string; coordinates: [number, number] };

	@Column({ type: 'varchar', length: 255 })
	description: string;

	@Column({ nullable: true, type: 'varchar' })
	photoUrl: string;

	@Column({ type: 'varchar', nullable: true })
	category: string;
}
