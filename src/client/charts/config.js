const config = {
  api: {
    keen: {
      projects: {
        flow: {
          projectId: process.env.KEEN_API_PROJECT_ID_FLOW,
          readKey: process.env.KEEN_API_READ_KEY_FLOW,
        },
        quality: {
          projectId: process.env.KEEN_API_PROJECT_ID_QUALITY,
          readKey: process.env.KEEN_API_READ_KEY_QUALITY,
        },
        usability: {
          projectId: process.env.KEEN_API_PROJECT_ID_USABILITY,
          readKey: process.env.KEEN_API_READ_KEY_USABILITY,
        },
        sentiment: {
          projectId: process.env.KEEN_API_PROJECT_ID_SENTIMENT,
          readKey: process.env.KEEN_API_READ_KEY_SENTIMENT,
        },
      }
    },
  },

  charts: {
    defaultOptions: {
      chartOptions: {
        legend: {position: 'bottom'},
      },
      colors: [
        'orange',
        'teal',
        'silver',
        'green',
        'red',
        'brown',
        'blue',
      ],
      width: 800,
      height: 240,
      labelMapping: {
        'game-prototype': 'design',
        'game': 'implementation',
      },
    },
  },

  sections: {
    flow: {
      title: 'Flow / Productivity',
      charts: {
        cycleTime: {
          options: {
            chartType: 'linechart',
            title: 'Cycle Time (past 90 days, rolling average)',
          },
          query: {
            analysisType: 'average',
            arguments: {
              eventCollection: 'issuesRollups',
              targetProperty: 'cycleTime',
              timeframe: 'this_90_days',
              interval: 'daily',
              groupBy: [
                'project',
              ],
            },
          },
        },
        leadTime: {
          options: {
            chartType: 'linechart',
            title: 'Lead Time (past 90 days, rolling average)',
          },
          query: {
            analysisType: 'average',
            arguments: {
              eventCollection: 'issuesRollups',
              targetProperty: 'leadTime',
              timeframe: 'this_90_days',
              interval: 'daily',
              groupBy: [
                'project',
              ],
            },
          },
        },
        throughput: {
          options: {
            chartType: 'linechart',
            title: 'Throughput (past 90 days)',
          },
          query: {
            analysisType: 'count',
            arguments: {
              eventCollection: 'issues',
              timeframe: 'this_90_days',
              interval: 'weekly',
              filters: [{
                operator: 'exists',
                property_name: 'boardRepoName',
                property_value: true,
              }, {
                operator: 'ne',
                property_name: 'cycleTime',
                property_value: 0,
              }],
              groupBy: [
                'boardRepoName',
              ],
            },
          },
        },
        wip: {
          options: {
            chartType: 'linechart',
            title: 'WIP (past 90 days, rolling average)',
          },
          query: {
            analysisType: 'average',
            arguments: {
              eventCollection: 'issuesRollups',
              targetProperty: 'wip',
              timeframe: 'this_90_days',
              interval: 'daily',
              groupBy: [
                'project',
              ],
            },
          },
        },
      },
    },
    quality: {
      title: 'Code Quality',
    },
    sentiment: {
      title: 'Code Sentiment',
    },
    usability: {
      title: 'Usability',
    },
  },
}

export default config
