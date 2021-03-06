import { LikedData } from '../domainEvents/liked';
import { MessageState } from '../MessageState';
import { AskInfrastructure, CommandData, CommandHandler, Schema, TellInfrastructure } from 'wolkenkit';

export interface LikeData extends CommandData {}

export const like: CommandHandler<MessageState, LikeData, AskInfrastructure & TellInfrastructure> = {
  getSchema (): Schema {
    return {
      type: 'object',
      properties: {},
      required: [],
      additionalProperties: false
    };
  },

  isAuthorized (): boolean {
    return true;
  },

  handle (state, _command, { aggregate, error }): void {
    if (aggregate.isPristine()) {
      throw new error.CommandRejected('Message was not yet sent.');
    }

    aggregate.publishDomainEvent<LikedData>('liked', {
      likes: state.likes + 1
    });
  }
};
