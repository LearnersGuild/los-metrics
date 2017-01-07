require('dotenv').config({
  silent: true,
  path: require('path').resolve(__dirname, `../.env.${process.env.NODE_ENV}`),
})

module.exports = {
  app: {
    baseURL: process.env.APP_BASE_URL,
    port: process.env.PORT || '9006',
    hotReload: false,
    minify: false,
    secure: false,
    idmBaseURL: process.env.IDM_BASE_URL,
  },
  api: {
    gitHub: {
      baseURL: 'https://api.github.com',
      token: process.env.GITHUB_API_TOKEN,
    },
    zenHub: {
      baseURL: 'https://api.zenhub.io',
      token: process.env.ZENHUB_API_TOKEN,
      unpublishedToken: process.env.ZENHUB_API_UNPUBLISHED_TOKEN,
    },
    codeClimate: {
      baseURL: 'https://api.codeclimate.com/v1',
      token: process.env.CODECLIMATE_API_TOKEN,
      orgId: '579a4e9ae43d44008a005a41',
    },
    keen: {
      baseURL: 'https://api.keen.io/3.0',
      projects: {
        flow: {
          projectId: process.env.KEEN_API_PROJECT_ID_FLOW,
          writeKey: process.env.KEEN_API_WRITE_KEY_FLOW,
          readKey: process.env.KEEN_API_READ_KEY_FLOW,
        },
        quality: {
          projectId: process.env.KEEN_API_PROJECT_ID_QUALITY,
          writeKey: process.env.KEEN_API_WRITE_KEY_QUALITY,
          readKey: process.env.KEEN_API_READ_KEY_QUALITY,
        },
        usability: {
          projectId: process.env.KEEN_API_PROJECT_ID_USABILITY,
          writeKey: process.env.KEEN_API_WRITE_KEY_USABILITY,
          readKey: process.env.KEEN_API_READ_KEY_USABILITY,
        },
        sentiment: {
          projectId: process.env.KEEN_API_PROJECT_ID_SENTIMENT,
          writeKey: process.env.KEEN_API_WRITE_KEY_SENTIMENT,
          readKey: process.env.KEEN_API_READ_KEY_SENTIMENT,
        },
      },
    },
    sentry: {
      baseURL: 'https://sentry.io/api/0',
      token: process.env.SENTRY_API_TOKEN,
      orgSlug: 'learners-guild',
    },
  },
  flow: {
    repos: [
      'game',
      'game-prototype',
    ],
    metrics: {
      'game': {
        wip: {
          lanes: [
            'In Progress',
            'Review',
          ],
        },
        cycleTime: {
          startLane: 'In Progress',
        },
        leadTime: {
          startLane: 'Backlog',
        },
        newIssuesLane: 'New Issues',
      },
      'game-prototype': {
        wip: {
          lanes: [
            'Game Mechanics',
            'UI Design',
            'In Progress',  // TODO: remove this after ZenHub stops reporting data on it (early 2017 should be safe)
            'Review',
          ],
        },
        cycleTime: {
          startLane: 'In Progress',
        },
        leadTime: {
          startLane: 'Backlog',
        },
        newIssuesLane: 'New Issues',
      },
    },
  },
  quality: {
    repos: [
      'game',
      'game-cli',
      'graphiql',
      'idm',
      'idm-jwt-auth',
      'rethinkdb-changefeed-reconnect',
      'subcli',
    ],
  },
  usability: {
    repo: 'los',
    mongoURL: process.env.ECHO_MONGO_URL,
  },
}
