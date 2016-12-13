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
        interpolateNulls: true,
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
      charts: {
        gpa: {
          options: {
            chartType: 'areachart',
            title: 'GPA (past 90 days, weighted mean)',
          },
          query: {
            analysisType: 'average',
            arguments: {
              eventCollection: 'repoRollups',
              targetProperty: 'weightedMeanGPA',
              timeframe: 'this_90_days',
              interval: 'daily',
            },
          },
        },
        coverage: {
          options: {
            chartType: 'areachart',
            title: 'Test Coverage (past 90 days, weighted mean)',
          },
          query: {
            analysisType: 'average',
            arguments: {
              eventCollection: 'repoRollups',
              targetProperty: 'weightedMeanCoverage',
              timeframe: 'this_90_days',
              interval: 'daily',
            },
          },
        },
      },
    },
    sentiment: {
      title: 'Code Sentiment',
      charts: {
        qualityPerAuthor: {
          options: {
            chartType: 'columnchart',
            title: 'Code Quality (past 90 days, average, per author)',
            chartOptions: {
              legend: {
                position: 'none',
              },
            },
          },
          query: {
            analysisType: 'average',
            arguments: {
              eventCollection: 'losSentimentReviewerSurveys',
              targetProperty: 'quality',
              timeframe: 'this_90_days',
              groupBy: [
                'author'
              ],
            },
          },
        },
        overallQuality: {
          options: {
            chartType: 'areachart',
            title: 'Code Quality (past 90 days, average)',
            chartOptions: {
              legend: {
                position: 'none',
              },
            },
          },
          query: {
            analysisType: 'average',
            arguments: {
              eventCollection: 'losSentimentAuthorSurveys',
              targetProperty: 'quality',
              timeframe: 'this_90_days',
              interval: 'daily',
            },
          },
        },
      },
    },
    usability: {
      title: 'Usability',
      charts: {
        supportMessageCounts: {
          options: {
            chartType: 'linechart',
            title: '#support Messages (past 90 days)',
            chartOptions: {
              legend: {
                position: 'none',
              },
            },
          },
          query: {
            analysisType: 'maximum',
            arguments: {
              eventCollection: 'supportMessageCounts',
              targetProperty: 'count',
              timeframe: 'this_90_days',
              interval: 'daily',
            },
          },
        },
        openIssueCounts: {
          options: {
            chartType: 'linechart',
            title: 'Open Issues (past 90 days, per label)',
          },
          query: {
            analysisType: 'maximum',
            arguments: {
              eventCollection: 'losIssueCountsByLabel',
              targetProperty: 'count',
              timeframe: 'this_90_days',
              interval: 'daily',
              filters: [{
                operator: 'eq',
                property_name: 'state',
                property_value: 'open',
              }],
              groupBy: [
                'label',
              ],
            },
          },
        },
        closedIssueCounts: {
          options: {
            chartType: 'linechart',
            title: 'Closed Issues (past 90 days, per label)',
          },
          query: {
            analysisType: 'maximum',
            arguments: {
              eventCollection: 'losIssueCountsByLabel',
              targetProperty: 'count',
              timeframe: 'this_90_days',
              interval: 'daily',
              filters: [{
                operator: 'eq',
                property_name: 'state',
                property_value: 'closed',
              }],
              groupBy: [
                'label',
              ],
            },
          },
        },
        unresolvedErrorCounts: {
          options: {
            chartType: 'linechart',
            title: 'Unresolved Errors (past 90 days, per service)',
          },
          query: {
            analysisType: 'maximum',
            arguments: {
              eventCollection: 'losErrorCountsByProject',
              targetProperty: 'count',
              timeframe: 'this_90_days',
              interval: 'daily',
              filters: [{
                operator: 'eq',
                property_name: 'status',
                property_value: 'unresolved',
              }],
              groupBy: [
                'projectSlug',
              ],
            },
          },
        },
        resolvedErrorCounts: {
          options: {
            chartType: 'linechart',
            title: 'Resolved Errors (past 90 days, per service)',
          },
          query: {
            analysisType: 'maximum',
            arguments: {
              eventCollection: 'losErrorCountsByProject',
              targetProperty: 'count',
              timeframe: 'this_90_days',
              interval: 'daily',
              filters: [{
                operator: 'eq',
                property_name: 'status',
                property_value: 'resolved',
              }],
              groupBy: [
                'projectSlug',
              ],
            },
          },
        },
      },
    },
  },
}

export default config
