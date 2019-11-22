'use strict';

/* eslint-disable object-property-newline */
const navigation = [
  { title: 'Getting started', children: [
    { title: 'Understanding wolkenkit', children: [
      { title: 'Why wolkenkit?', keywords: [ 'ddd', 'eventsourcing', 'cqrs', 'crud' ]},
      { title: 'Core concepts', keywords: [ 'read', 'write', 'model', 'flows', 'context', 'aggregate' ]},
      { title: 'Architecture', keywords: [ 'eventstore', 'eventsourcing', 'cqrs' ]},
      { title: 'Getting help', keywords: [ 'community', 'slack', 'stackoverflow' ]}
    ]},
    { title: 'Installing wolkenkit', children: [
      { title: 'Verifying system requirements' },
      { title: 'Installing on macOS', keywords: [ 'docker' ]},
      { title: 'Installing on Linux', keywords: [ 'docker' ]},
      { title: 'Installing on Windows', keywords: [ 'docker' ]},
      { title: 'Installing using Vagrant' },
      { title: 'Installing using Docker Machine' }
    ]},
    { title: 'Updating wolkenkit', children: [
      { title: 'Changelog' },
      { title: 'Updating the CLI', keywords: [ 'update' ]},
      { title: 'Updating an application', keywords: [ 'update' ]}
    ]}
  ]},
  { title: 'Guides', children: [
    { title: 'Creating your first application', children: [
      { title: 'Setting the objective' },
      { title: 'Creating the application' }
    ]},
    { title: 'Creating an application from scratch', children: [
      { title: 'Setting the objective' },
      { title: 'Modeling with your team', keywords: [ 'ddd' ]},
      { title: 'Creating the write model' },
      { title: 'Creating the read model' },
      { title: 'Creating the client' }
    ]}
  ]},
  { title: 'Reference', children: [
    { title: 'Initializing an application', children: [
      { title: 'Using a template' },
      { title: 'Starting from scratch' }
    ]},
    { title: 'Creating the write model', children: [
      { title: 'Overview' },
      { title: 'Defining contexts' },
      { title: 'Defining aggregates' },
      { title: 'Defining the initial state' },
      { title: 'Defining commands' },
      { title: 'Defining events' },
      { title: 'Using command middleware' },
      { title: 'Using command services' },
      { title: 'Collecting IoT events' },
      { title: 'Configuring authorization' }
    ]},
    { title: 'Creating the read model', children: [
      { title: 'Overview' },
      { title: 'Defining lists' },
      { title: 'Defining fields' },
      { title: 'Defining projections' },
      { title: 'Writing where clauses' },
      { title: 'Writing update statements' },
      { title: 'Finding items' },
      { title: 'Using services' },
      { title: 'Configuring authorization' }
    ]},
    { title: 'Creating stateless flows', children: [
      { title: 'Overview' },
      { title: 'Defining flows' },
      { title: 'Reacting to events' },
      { title: 'Using services' }
    ]},
    { title: 'Creating stateful flows', children: [
      { title: 'Overview' },
      { title: 'Defining flows' },
      { title: 'Identifying flows' },
      { title: 'Defining the initial state' },
      { title: 'Defining state transitions' },
      { title: 'Reacting to state transitions' },
      { title: 'Using services' }
    ]},
    { title: 'Configuring an application', children: [
      { title: 'Naming an application' },
      { title: 'Pinning the runtime' },
      { title: 'Setting the host and port' },
      { title: 'Allowing client domains' },
      { title: 'Using custom certificates' },
      { title: 'Enabling authentication' },
      { title: 'Assigning a Docker Machine' },
      { title: 'Using environments' },
      { title: 'Setting the Node.js environment' },
      { title: 'Setting environment variables' }
    ]},
    { title: 'Using the CLI', children: [
      { title: 'Controlling the lifecycle' },
      { title: 'Protecting an application', keywords: [ 'shared-key' ]},
      { title: 'Storing data permanently', keywords: [ 'shared-key' ]},
      { title: 'Using environments' }
    ]},
    { title: 'Building a client', children: [
      { title: 'Connecting to an application' },
      { title: 'Sending commands' },
      { title: 'Receiving events' },
      { title: 'Reading lists', keywords: [ 'query', 'operators', 'order' ]},
      { title: 'Handling application events' },
      { title: 'Using authentication', keywords: [ 'openid', 'user', 'profile' ]},
      { title: 'Sending IoT events' },
      { title: 'Storing files' }
    ]},
    { title: 'Debugging an application', children: [
      { title: 'Attaching a debugger' },
      { title: 'Viewing log messages' },
      { title: 'Using Docker' }
    ]},
    { title: 'Data structures', children: [
      { title: 'Commands', keywords: [ 'schema' ]},
      { title: 'Events', keywords: [ 'schema' ]}
    ]}
  ]},
  { title: 'Media', children: [
    { title: 'Downloads', children: [
      { title: 'Brochure' },
      { title: 'Cheatsheet' }
    ]},
    { title: 'Online resources', children: [
      { title: 'Articles' },
      { title: 'Blog posts' }
    ]},
    { title: 'Sample applications', children: [
      { title: 'wolkenkit-boards' },
      { title: 'wolkenkit-geocaching' },
      { title: 'wolkenkit-nevercompletedgame' },
      { title: 'wolkenkit-template-chat' },
      { title: 'wolkenkit-todomvc' }
    ]}
  ]},
  { title: 'Legal', children: [
    { title: 'Imprint' }
  ]}
];
/* eslint-enable object-property-newline */

module.exports = navigation;
