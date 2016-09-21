require('dotenv').config({
  silent: true,
  path: require('path').resolve(__dirname, `../.env.${process.env.NODE_ENV}`),
})

module.exports = {
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
      baseURL: 'https://codeclimate.com/api',
      token: process.env.CODECLIMATE_API_TOKEN,
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
}
