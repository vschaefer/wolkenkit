import { assert } from 'assertthat';
import { CustomError } from 'defekt';
import { DomainEventWithState } from '../../../../lib/common/elements/DomainEventWithState';
import fs from 'fs';
import { getTestApplicationDirectory } from '../../../shared/applications/getTestApplicationDirectory';
import { isolated } from 'isolated';
import { loadApplication } from '../../../../lib/common/application/loadApplication';
import path from 'path';
import { Services } from '../../../../lib/common/domain/domainEvent/Services';
import { uuid } from 'uuidv4';

suite('loadApplication', (): void => {
  test('throws an error if a non-existent directory is given.', async (): Promise<void> => {
    await assert.that(async (): Promise<void> => {
      await loadApplication({ applicationDirectory: path.join(__dirname, 'does', 'not', 'exist') });
    }).is.throwingAsync((ex): boolean => (ex as CustomError).code === 'EAPPLICATIONNOTFOUND');
  });

  test('throws an error if the given directory does not contain a package.json.', async (): Promise<void> => {
    const applicationDirectory = await isolated();

    await assert.that(async (): Promise<void> => {
      await loadApplication({ applicationDirectory });
    }).is.throwingAsync((ex): boolean => (ex as CustomError).code === 'EFILENOTFOUND' && ex.message === `File '<app>/package.json' not found.`);
  });

  test('throws an error if the given directory does not contain a build directory.', async (): Promise<void> => {
    const applicationDirectory = await isolated();
    const packageManifestPath = path.join(applicationDirectory, 'package.json');

    await fs.promises.writeFile(packageManifestPath, JSON.stringify({
      name: 'app',
      version: '1.0.0'
    }, null, 2));

    await assert.that(async (): Promise<void> => {
      await loadApplication({ applicationDirectory });
    }).is.throwingAsync((ex): boolean => (ex as CustomError).code === 'EDIRECTORYNOTFOUND' && ex.message === `Directory '<app>/build' not found.`);
  });

  test('loads the base application.', async (): Promise<void> => {
    const applicationDirectory = getTestApplicationDirectory({ name: 'base' });
    const application = await loadApplication({ applicationDirectory });

    assert.that(application).is.atLeast({
      domain: {
        sampleContext: {
          sampleAggregate: {
            commandHandlers: {
              execute: {}
            },
            domainEventHandlers: {
              succeeded: {},
              executed: {}
            }
          }
        }
      },
      views: {
        sampleView: {
          initializer: {},
          projectionHandlers: {
            executed: {}
          },
          queryHandlers: {
            all: {}
          }
        }
      }
    });
  });

  test('adds system events and handlers.', async (): Promise<void> => {
    const applicationDirectory = getTestApplicationDirectory({ name: 'base' });
    const application = await loadApplication({ applicationDirectory });

    assert.that(application).is.atLeast({
      domain: {
        sampleContext: {
          sampleAggregate: {
            domainEventHandlers: {
              authenticateFailed: {},
              authenticateRejected: {},
              authorizeFailed: {},
              authorizeRejected: {},
              executeFailed: {},
              executeRejected: {}
            }
          }
        }
      }
    });

    const userId = uuid();

    assert.that(
      application.domain.sampleContext.sampleAggregate.domainEventHandlers.authenticateFailed.isAuthorized(
        {},
        { metadata: { initiator: { user: { id: userId }}}} as DomainEventWithState<any, any>,
        { client: { user: { id: userId }}} as Services
      )
    ).is.true();

    assert.that(
      application.domain.sampleContext.sampleAggregate.domainEventHandlers.authenticateFailed.isAuthorized(
        {},
        { metadata: { initiator: { user: { id: userId }}}} as DomainEventWithState<any, any>,
        { client: { user: { id: uuid() }}} as Services
      )
    ).is.false();
  });

  test('applies aggregate enhancers.', async (): Promise<void> => {
    const applicationDirectory = getTestApplicationDirectory({ name: 'withAggregateEnhancer' });
    const application = await loadApplication({ applicationDirectory });

    assert.that(application).is.atLeast({
      domain: {
        sampleContext: {
          sampleAggregate: {
            commandHandlers: {
              enhancedCommand: {}
            },
            domainEventHandlers: {
              enhancedDomainEvent: {}
            }
          }
        }
      }
    });
  });

  test('applies view enhancers.', async (): Promise<void> => {
    const applicationDirectory = getTestApplicationDirectory({ name: 'withViewEnhancer' });
    const application = await loadApplication({ applicationDirectory });

    assert.that(application).is.atLeast({
      views: {
        sampleView: {
          projectionHandlers: {
            enhancedProjection: {}
          },
          queryHandlers: {
            enhancedQuery: {}
          }
        }
      }
    });
  });

  test('throws an error if the domain directory is missing.', async (): Promise<void> => {
    const applicationDirectory = getTestApplicationDirectory({ name: 'withoutDomainDirectory' });

    await assert.
      that(async (): Promise<any> => loadApplication({ applicationDirectory })).
      is.throwingAsync(`Directory '<app>/build/domain' not found.`);
  });

  test('throws an error if the domain contains an empty aggregate directory.', async (): Promise<void> => {
    const applicationDirectory = getTestApplicationDirectory({ name: 'withEmptyAggregateDirectory' });

    await assert.
      that(async (): Promise<any> => loadApplication({ applicationDirectory })).
      is.throwingAsync(`No aggregate definition in '<app>/build/domain/sampleContext/emptyAggregate' found.`);
  });

  test('throws an error if an aggregate is malformed.', async (): Promise<void> => {
    const applicationDirectory = getTestApplicationDirectory({ name: 'withInvalidAggregate' });

    await assert.
      that(async (): Promise<any> => loadApplication({ applicationDirectory })).
      is.throwingAsync(`Aggregate definition '<app>/build/domain/sampleContext/invalidAggregate' is malformed: Function 'getInitialState' is missing.`);
  });

  test('throws an error if the views directory is missing.', async (): Promise<void> => {
    const applicationDirectory = getTestApplicationDirectory({ name: 'withoutViewsDirectory' });

    await assert.
      that(async (): Promise<any> => loadApplication({ applicationDirectory })).
      is.throwingAsync(`Directory '<app>/build/views' not found.`);
  });

  test('throws an error if the domain contains an empty view directory.', async (): Promise<void> => {
    const applicationDirectory = getTestApplicationDirectory({ name: 'withEmptyViewDirectory' });

    await assert.
      that(async (): Promise<any> => loadApplication({ applicationDirectory })).
      is.throwingAsync(`No view definition in '<app>/build/views/emptyView' found.`);
  });

  test('throws an error if a view is malformed.', async (): Promise<void> => {
    const applicationDirectory = getTestApplicationDirectory({ name: 'withInvalidView' });

    await assert.
      that(async (): Promise<any> => loadApplication({ applicationDirectory })).
      is.throwingAsync(`View definition '<app>/build/views/invalidView' is malformed: Object 'initializer' is missing.`);
  });

  test('throws an appropriate error if any file in the application contains a syntax error.', async (): Promise<void> => {
    const applicationDirectory = getTestApplicationDirectory({ name: 'withSyntaxError' });

    await assert.
      that(async (): Promise<any> => loadApplication({ applicationDirectory })).
      is.throwingAsync((ex): boolean => (ex as CustomError).code === 'EAPPLICATIONMALFORMED');
  });

  test('throws an error if the infrastructure directory is missing.', async (): Promise<void> => {
    const applicationDirectory = getTestApplicationDirectory({ name: 'withoutInfrastructureDirectory' });

    await assert.
      that(async (): Promise<any> => loadApplication({ applicationDirectory })).
      is.throwingAsync(`Directory '<app>/build/infrastructure' not found.`);
  });
});
