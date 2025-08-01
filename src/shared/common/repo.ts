import { Itinerary } from '../db/entities/itinerary.entity';
import { User } from '../db/entities/user.entitiy';
import { Place } from '../db/entities/place.entity';
import { getRepository } from './get-repository';

export const itineraryRepo = getRepository(Itinerary);
export const userRepo = getRepository(User);
export const placeRepo = getRepository(Place);
