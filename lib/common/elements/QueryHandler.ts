import { ClientService } from '../services/ClientService';
import { LoggerService } from '../services/LoggerService';
import { Readable } from 'stream';
import { Schema } from './Schema';

export interface QueryHandler<TQueryOptions, TQueryResultItem, TInfrastructure> {
  getDocumentation? (): string;

  getOptionsSchema? (): Schema;

  getResultItemSchema? (): Schema;

  handle (queryOptions: TQueryOptions, infrastructure: TInfrastructure, services: {
    client: ClientService;
    logger: LoggerService;
  }): Readable | Promise<Readable> | TQueryResultItem | Promise<TQueryResultItem>;

  isAuthorized (infrastructure: TInfrastructure, services: {
    client: ClientService;
    logger: LoggerService;
  }): boolean | Promise<boolean>;
}
