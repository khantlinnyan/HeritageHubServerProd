import { ObjectLiteral, Repository } from 'typeorm';
import AppDataSource from '../../shared/db/database';

const repositoryCache = new Map<string, Repository<any>>();

export const getRepository = <T extends ObjectLiteral>(entity: { new (): T }): Repository<T> => {
	const entityName = entity.name;

	if (repositoryCache.has(entityName)) {
		return repositoryCache.get(entityName) as Repository<T>;
	}

	const repository = AppDataSource.getRepository(entity);
	repositoryCache.set(entityName, repository);
	return repository;
};
