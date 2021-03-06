import axios from 'axios';
import { Command } from '../../../../common/elements/Command';
import { CommandData } from '../../../../common/elements/CommandData';
import { CommandDescription } from '../../../../common/application/CommandDescription';
import { errors } from '../../../../common/errors';
import { flaschenpost } from 'flaschenpost';
import { HttpClient } from '../../../shared/HttpClient';
import { ItemIdentifier } from '../../../../common/elements/ItemIdentifier';

const logger = flaschenpost.getLogger();

class Client extends HttpClient {
  public constructor ({ protocol = 'http', hostName, port, path = '/' }: {
    protocol?: string;
    hostName: string;
    port: number;
    path?: string;
  }) {
    super({ protocol, hostName, port, path });
  }

  public async getDescription (): Promise<Record<string, Record<string, Record<string, CommandDescription>>>> {
    const { data } = await axios({
      method: 'get',
      url: `${this.url}/description`,
      validateStatus (): boolean {
        return true;
      }
    });

    return data;
  }

  public async postCommand ({ command }: {
    command: Command<CommandData>;
  }): Promise<{ id: string }> {
    const { status, data } = await axios({
      method: 'post',
      url: `${this.url}/${command.contextIdentifier.name}/${command.aggregateIdentifier.name}/${command.aggregateIdentifier.id}/${command.name}`,
      data: command.data,
      validateStatus (): boolean {
        return true;
      }
    });

    if (status === 200) {
      return { id: data.id };
    }

    switch (data.code) {
      case 'ENOTAUTHENTICATEDERROR': {
        throw new errors.NotAuthenticatedError(data.message);
      }
      case 'ECOMMANDMALFORMED': {
        throw new errors.CommandMalformed(data.message);
      }
      case 'ECONTEXTNOTFOUND': {
        throw new errors.ContextNotFound(data.message);
      }
      case 'EAGGREGATENOTFOUND': {
        throw new errors.AggregateNotFound(data.message);
      }
      case 'ECOMMANDNOTFOUND': {
        throw new errors.CommandNotFound(data.message);
      }
      default: {
        logger.error('An unknown error occured.', { ex: data, status });

        throw new errors.UnknownError();
      }
    }
  }

  public async cancelCommand ({ commandIdentifier }: {
    commandIdentifier: ItemIdentifier;
  }): Promise<void> {
    const { status, data } = await axios({
      method: 'post',
      url: `${this.url}/cancel`,
      data: commandIdentifier,
      validateStatus (): boolean {
        return true;
      }
    });

    switch (status) {
      case 200: {
        return;
      }
      case 400: {
        switch (data.code) {
          case 'ECONTEXTNOTFOUND': {
            throw new errors.ContextNotFound(data.message);
          }
          case 'EAGGREGATENOTFOUND': {
            throw new errors.AggregateNotFound(data.message);
          }
          case 'ECOMMANDNOTFOUND': {
            throw new errors.CommandNotFound(data.message);
          }
          default: {
            throw new errors.UnknownError();
          }
        }
      }
      case 404: {
        throw new errors.ItemNotFound(data.message);
      }
      default: {
        throw new errors.UnknownError();
      }
    }
  }
}

export { Client };
