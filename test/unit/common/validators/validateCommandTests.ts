import { Application } from '../../../../lib/common/application/Application';
import { assert } from 'assertthat';
import { Command } from '../../../../lib/common/elements/Command';
import { CustomError } from 'defekt';
import { getTestApplicationDirectory } from '../../../shared/applications/getTestApplicationDirectory';
import { loadApplication } from '../../../../lib/common/application/loadApplication';
import { uuid } from 'uuidv4';
import { validateCommand } from '../../../../lib/common/validators/validateCommand';

suite('validateCommand', (): void => {
  const applicationDirectory = getTestApplicationDirectory({ name: 'base' });

  const command = new Command({
    contextIdentifier: { name: 'sampleContext' },
    aggregateIdentifier: { name: 'sampleAggregate', id: uuid() },
    name: 'execute',
    data: {
      strategy: 'succeed'
    }
  });

  let application: Application;

  suiteSetup(async (): Promise<void> => {
    application = await loadApplication({ applicationDirectory });
  });

  test('does not throw an error if everything is fine.', async (): Promise<void> => {
    assert.that((): void => {
      validateCommand({ command, application });
    }).is.not.throwing();
  });

  test(`throws an error if the command's context doesn't exist in the application definition.`, async (): Promise<void> => {
    assert.that((): void => {
      validateCommand({
        command: {
          ...command,
          contextIdentifier: {
            name: 'someContext'
          }
        },
        application
      });
    }).is.throwing(
      (ex): boolean =>
        (ex as CustomError).code === 'ECONTEXTNOTFOUND' &&
        ex.message === `Context 'someContext' not found.`
    );
  });

  test(`throws an error if the command's aggregate doesn't exist in the application definition.`, async (): Promise<void> => {
    assert.that((): void => {
      validateCommand({
        command: {
          ...command,
          aggregateIdentifier: {
            name: 'someAggregate',
            id: uuid()
          }
        },
        application
      });
    }).is.throwing(
      (ex): boolean =>
        (ex as CustomError).code === 'EAGGREGATENOTFOUND' &&
        ex.message === `Aggregate 'sampleContext.someAggregate' not found.`
    );
  });

  test(`throws an error if the command doesn't exist in the application definition.`, async (): Promise<void> => {
    assert.that((): void => {
      validateCommand({
        command: {
          ...command,
          name: 'someCommand'
        },
        application
      });
    }).is.throwing(
      (ex): boolean =>
        (ex as CustomError).code === 'ECOMMANDNOTFOUND' &&
        ex.message === `Command 'sampleContext.sampleAggregate.someCommand' not found.`
    );
  });

  test(`throws an error if the command's data doesn't match its schema.`, async (): Promise<void> => {
    assert.that((): void => {
      validateCommand({
        command: {
          ...command,
          data: {
            foo: ''
          }
        },
        application
      });
    }).is.throwing(
      (ex): boolean =>
        (ex as CustomError).code === 'ECOMMANDMALFORMED' &&
        ex.message === `Missing required property: strategy (at command.data.strategy).`
    );
  });
});
