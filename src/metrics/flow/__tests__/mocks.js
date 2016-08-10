/* eslint-disable camelcase */

export function zhRepo() {
  return {
    repo_id: 123,
    cached_repo_name: 'game',
  }
}

export function gitHubIssueCompleted() {
  return {
    id: 444,
    created_at: '2016-04-03T00:00:00.000Z',
    closed_at: '2016-04-10T00:00:00.000Z',
  }
}

export function gitHubIssueInProgress() {
  return {
    id: 444,
    created_at: '2016-04-03T00:00:00.000Z',
    closed_at: null,
  }
}

export function zhIssueEventsCompleted() {
  return [{
    user_id: 123,
    type: 'transferIssue',
    created_at: '2016-04-04T00:00:00.000Z',
    from_pipeline: {name: 'New Issues'},
    to_pipeline: {name: 'Backlog'},
  }, {
    user_id: 123,
    type: 'transferIssue',
    created_at: '2016-04-05T00:00:00.000Z',
    from_pipeline: {name: 'Backlog'},
    to_pipeline: {name: 'To Do'},
  }, {
    user_id: 234,
    type: 'transferIssue',
    created_at: '2016-04-06T00:00:00.000Z',
    from_pipeline: {name: 'To Do'},
    to_pipeline: {name: 'In Progress'},
  }, {
    user_id: 234,
    type: 'transferIssue',
    created_at: '2016-04-07T00:00:00.000Z',
    from_pipeline: {name: 'In Progress'},
    to_pipeline: {name: 'To Do'},
  }, {
    user_id: 234,
    type: 'transferIssue',
    created_at: '2016-04-08T00:00:00.000Z',
    from_pipeline: {name: 'To Do'},
    to_pipeline: {name: 'In Progress'},
  }, {
    user_id: 234,
    type: 'transferIssue',
    created_at: '2016-04-09T00:00:00.000Z',
    from_pipeline: {name: 'In Progress'},
    to_pipeline: {name: 'Review'},
  }]
}

export function zhIssueEventsInProgress() {
  return [{
    user_id: 123,
    type: 'transferIssue',
    created_at: '2016-04-04T00:00:00.000Z',
    from_pipeline: {name: 'New Issues'},
    to_pipeline: {name: 'Backlog'},
  }, {
    user_id: 123,
    type: 'transferIssue',
    created_at: '2016-04-05T00:00:00.000Z',
    from_pipeline: {name: 'Backlog'},
    to_pipeline: {name: 'In Progress'},
  }, {
    user_id: 123,
    type: 'transferIssue',
    created_at: '2016-04-06T00:00:00.000Z',
    from_pipeline: {name: 'In Progress'},
    to_pipeline: {name: 'Backlog'},
  }, {
    user_id: 123,
    type: 'transferIssue',
    created_at: '2016-04-07T00:00:00.000Z',
    from_pipeline: {name: 'Backlog'},
    to_pipeline: {name: 'In Progress'},
  }]
}

export function zenHubBoardInfo() {
  return {
    _id: '56d4f31d753f689a4ac653fc',
    __v: 2946,
    last_modified: '2016-03-01T01:40:45.221Z',
    created_at: '2016-03-01T01:40:45.221Z',
    pipelines: [
      {
        name: 'New Issues',
        _id: '56d4f31d753f689a4ac65401',
        issues: [
          {
            _id: 1,
            repo_id: 59869508,
            issue_number: 21
          },
          {
            issue_number: 1,
            repo_id: 54755185,
            _id: 1
          },
          {
            _id: 1,
            repo_id: 53085691,
            issue_number: 28
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 330
          },
          {
            _id: 1,
            repo_id: 45145512,
            issue_number: 47
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 21
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 22
          },
          {
            _id: 1,
            repo_id: 45145512,
            issue_number: 68
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 33
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 36
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 47
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 103
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 113
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 115
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 119
          },
          {
            _id: 1,
            repo_id: 60109787,
            issue_number: 5
          },
          {
            _id: 1,
            repo_id: 60109787,
            issue_number: 6
          },
          {
            _id: 1,
            repo_id: 45145512,
            issue_number: 92
          },
          {
            _id: 1,
            repo_id: 45145512,
            issue_number: 93
          },
          {
            _id: 1,
            repo_id: 45145512,
            issue_number: 94
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 166
          },
          {
            _id: 1,
            repo_id: 59869508,
            issue_number: 33
          },
          {
            _id: 1,
            repo_id: 59869508,
            issue_number: 34
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 187
          },
          {
            _id: 1,
            repo_id: 55656445,
            issue_number: 4
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 198
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 203
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 204
          },
          {
            _id: 1,
            repo_id: 53085691,
            issue_number: 19
          },
          {
            _id: 1,
            repo_id: 53085691,
            issue_number: 24
          },
          {
            _id: 1,
            repo_id: 59869508,
            issue_number: 54
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 66
          },
          {
            _id: 1,
            repo_id: 59869508,
            issue_number: 28
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 264
          },
          {
            _id: 1,
            repo_id: 53085691,
            issue_number: 31
          },
          {
            _id: 1,
            repo_id: 45145512,
            issue_number: 106
          },
          {
            _id: 1,
            repo_id: 45145512,
            issue_number: 107
          },
          {
            _id: 1,
            repo_id: 45145512,
            issue_number: 108
          },
          {
            _id: 1,
            repo_id: 59869508,
            issue_number: 72
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 286
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 294
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 298
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 303
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 315
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 253
          },
          {
            _id: 1,
            repo_id: 53085691,
            issue_number: 46
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 342
          },
          {
            _id: 1,
            repo_id: 59869508,
            issue_number: 77
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 288
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 326
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 291
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 359
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 361
          },
          {
            _id: 1,
            repo_id: 54755185,
            issue_number: 3
          },
          {
            _id: 1,
            repo_id: 53085691,
            issue_number: 51
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 332
          },
          {
            _id: 1,
            repo_id: 45145512,
            issue_number: 59
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 370
          },
          {
            repo_id: 53369107,
            issue_number: 362,
            _id: 1
          },
          {
            repo_id: 53369107,
            issue_number: 364,
            _id: 1
          },
          {
            repo_id: 45145512,
            issue_number: 12,
            _id: 1
          },
          {
            repo_id: 45145512,
            issue_number: 70,
            _id: 1
          },
          {
            repo_id: 45145512,
            issue_number: 71,
            _id: 1
          },
          {
            repo_id: 45145512,
            issue_number: 72,
            _id: 1
          },
          {
            repo_id: 45145512,
            issue_number: 75,
            _id: 1
          },
          {
            repo_id: 45145512,
            issue_number: 76,
            _id: 1
          },
          {
            repo_id: 45145512,
            issue_number: 80,
            _id: 1
          },
          {
            repo_id: 45145512,
            issue_number: 84,
            _id: 1
          },
          {
            repo_id: 45145512,
            issue_number: 85,
            _id: 1
          },
          {
            repo_id: 45145512,
            issue_number: 88,
            _id: 1
          },
          {
            repo_id: 45145512,
            issue_number: 89,
            _id: 1
          },
          {
            repo_id: 45145512,
            issue_number: 90,
            _id: 1
          },
          {
            repo_id: 45145512,
            issue_number: 96,
            _id: 1
          },
          {
            repo_id: 45145512,
            issue_number: 99,
            _id: 1
          },
          {
            repo_id: 45145512,
            issue_number: 101,
            _id: 1
          },
          {
            repo_id: 45145512,
            issue_number: 102,
            _id: 1
          },
          {
            repo_id: 45145512,
            issue_number: 103,
            _id: 1
          },
          {
            repo_id: 45145512,
            issue_number: 109,
            _id: 1
          },
          {
            repo_id: 45145512,
            issue_number: 111,
            _id: 1
          },
          {
            repo_id: 45145512,
            issue_number: 113,
            _id: 1
          },
          {
            repo_id: 45145512,
            issue_number: 114,
            _id: 1
          },
          {
            _id: 1,
            repo_id: 45145512,
            issue_number: 120
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 183
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 351
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 339
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 236
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 380
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 182
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 111
          },
          {
            _id: 1,
            repo_id: 59869508,
            issue_number: 19
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 150
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 388
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 324
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 333
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 314
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 318
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 357
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 352
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 353
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 190
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 322
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 382
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 383
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 350
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 281
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 137
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 384
          },
          {
            repo_id: 60109787,
            issue_number: 1,
            _id: 1
          },
          {
            repo_id: 60109787,
            issue_number: 3,
            _id: 1
          },
          {
            repo_id: 53085691,
            issue_number: 1,
            _id: 1
          },
          {
            repo_id: 53085691,
            issue_number: 2,
            _id: 1
          },
          {
            repo_id: 53085691,
            issue_number: 3,
            _id: 1
          },
          {
            repo_id: 53085691,
            issue_number: 4,
            _id: 1
          },
          {
            repo_id: 53085691,
            issue_number: 5,
            _id: 1
          },
          {
            repo_id: 53085691,
            issue_number: 7,
            _id: 1
          },
          {
            repo_id: 53085691,
            issue_number: 12,
            _id: 1
          },
          {
            repo_id: 53085691,
            issue_number: 13,
            _id: 1
          },
          {
            repo_id: 53085691,
            issue_number: 15,
            _id: 1
          },
          {
            repo_id: 53085691,
            issue_number: 27,
            _id: 1
          },
          {
            repo_id: 53085691,
            issue_number: 36,
            _id: 1
          },
          {
            repo_id: 53085691,
            issue_number: 44,
            _id: 1
          },
          {
            repo_id: 53085691,
            issue_number: 45,
            _id: 1
          },
          {
            repo_id: 53085691,
            issue_number: 49,
            _id: 1
          },
          {
            repo_id: 53085691,
            issue_number: 52,
            _id: 1
          },
          {
            repo_id: 59869508,
            issue_number: 4,
            _id: 1
          },
          {
            repo_id: 59869508,
            issue_number: 7,
            _id: 1
          },
          {
            repo_id: 59869508,
            issue_number: 9,
            _id: 1
          },
          {
            repo_id: 59869508,
            issue_number: 10,
            _id: 1
          },
          {
            repo_id: 59869508,
            issue_number: 15,
            _id: 1
          },
          {
            repo_id: 59869508,
            issue_number: 16,
            _id: 1
          },
          {
            repo_id: 59869508,
            issue_number: 17,
            _id: 1
          },
          {
            repo_id: 59869508,
            issue_number: 20,
            _id: 1
          },
          {
            repo_id: 59869508,
            issue_number: 23,
            _id: 1
          },
          {
            repo_id: 59869508,
            issue_number: 25,
            _id: 1
          },
          {
            repo_id: 59869508,
            issue_number: 30,
            _id: 1
          },
          {
            repo_id: 59869508,
            issue_number: 36,
            _id: 1
          },
          {
            repo_id: 59869508,
            issue_number: 38,
            _id: 1
          },
          {
            repo_id: 59869508,
            issue_number: 40,
            _id: 1
          },
          {
            repo_id: 59869508,
            issue_number: 41,
            _id: 1
          },
          {
            repo_id: 59869508,
            issue_number: 47,
            _id: 1
          },
          {
            repo_id: 59869508,
            issue_number: 52,
            _id: 1
          },
          {
            repo_id: 59869508,
            issue_number: 56,
            _id: 1
          },
          {
            repo_id: 59869508,
            issue_number: 59,
            _id: 1
          },
          {
            repo_id: 59869508,
            issue_number: 62,
            _id: 1
          },
          {
            repo_id: 59869508,
            issue_number: 64,
            _id: 1
          },
          {
            repo_id: 59869508,
            issue_number: 66,
            _id: 1
          },
          {
            repo_id: 59869508,
            issue_number: 68,
            _id: 1
          },
          {
            repo_id: 59869508,
            issue_number: 69,
            _id: 1
          },
          {
            repo_id: 59869508,
            issue_number: 71,
            _id: 1
          },
          {
            repo_id: 59869508,
            issue_number: 74,
            _id: 1
          },
          {
            repo_id: 59869508,
            issue_number: 76,
            _id: 1
          },
          {
            repo_id: 55656445,
            issue_number: 3,
            _id: 1
          }
        ]
      },
      {
        name: 'Backlog',
        _id: '56d4f31d753f689a4ac65400',
        issues: [
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 270
          },
          {
            _id: 1,
            repo_id: 45145512,
            issue_number: 104
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 354
          },
          {
            _id: 1,
            repo_id: 45145512,
            issue_number: 58
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 379
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 59
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 116
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 348
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 386
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 385
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 110
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 196
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 192
          },
          {
            _id: 1,
            repo_id: 45145512,
            issue_number: 98
          }
        ]
      },
      {
        _id: '56d4f3e1753f689a4ac65415',
        name: 'To Do',
        issues: [
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 378
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 374
          }
        ]
      },
      {
        name: 'In Progress',
        _id: '56d4f31d753f689a4ac653fe',
        issues: [
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 376
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 338
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 377
          },
          {
            _id: 1,
            repo_id: 54755185,
            issue_number: 4
          },
          {
            _id: 1,
            repo_id: 45145512,
            issue_number: 118
          }
        ]
      },
      {
        name: 'Review',
        _id: '56d4f31d753f689a4ac653fd',
        issues: [
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 387
          },
          {
            repo_id: 45145512,
            issue_number: 121,
            _id: 1
          },
          {
            _id: 1,
            repo_id: 45145512,
            issue_number: 115
          },
          {
            _id: 1,
            repo_id: 45145512,
            issue_number: 117
          },
          {
            _id: 1,
            repo_id: 45145512,
            issue_number: 116
          },
          {
            _id: 1,
            repo_id: 53369107,
            issue_number: 381
          }
        ]
      }
    ]
  }
}
