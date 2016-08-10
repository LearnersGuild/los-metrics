import test from 'blue-tape'
import nock from 'nock'

import {getReposForBoard, getBoardInfo, getIssueEvents} from '../zenHub'

test('fetchers/zenHub', t => {
  t.test('getReposForBoard returns a Promise', tt => {
    tt.plan(1)

    /* eslint-disable camelcase */
    const expected = {
      repos: [{
        repo_id: 123,
        board: 'i-am-a-board-id',
        cached_repo_owner: 'LearnersGuild',
        cached_repo_name: 'some-repo'
      }, {
        repo_id: 234,
        board: 'i-am-a-board-id',
        cached_repo_owner: 'LearnersGuild',
        cached_repo_name: 'some-other-repo'
      }]
    }
    nock('https://api.zenhub.io')
      .get('/v4/repos/123/board/repos')
      .reply(200, JSON.stringify(expected))

    return getReposForBoard(123)
      .then(data => tt.deepEqual(data, expected))
  })

  t.test('getBoardInfo returns a Promise', tt => {
    tt.plan(1)

    /* eslint-disable camelcase */
    const expected = {
      pipelines: [{
        name: 'New Issues',
        issues: [{
          issue_number: 3,
          position: 0,
        }, {
          issue_number: 4,
          position: 1,
        }]
      }, {
        name: 'Design / Spec',
        issues: []
      }, {
        name: 'Design Review',
        issues: []
      }, {
        name: 'Backlog',
        issues: []
      }, {
        name: 'To-Do',
        issues: []
      }, {
        name: 'In Progress',
        issues: [{
          issue_number: 2,
          position: 0,
        }]
      }, {
        name: 'PR Review',
        issues: [{
          issue_number: 1,
          position: 0,
        }]
      }]
    }
    nock('https://api.zenhub.io')
      .get('/p1/repositories/123/board')
      .reply(200, JSON.stringify(expected))

    return getBoardInfo(123)
      .then(data => tt.deepEqual(data, expected))
  })

  t.test('getIssueEvents returns a Promise', tt => {
    tt.plan(1)

    /* eslint-disable camelcase */
    const expected = [{
      user_id: 123,
      type: 'transferIssue',
      created_at: '2016-04-04T20:55:50.090Z',
      from_pipeline: {name: 'Backlog'},
      to_pipeline: {name: 'To Do'}
    }, {
      user_id: 234,
      type: 'transferIssue',
      created_at: '2016-03-29T00:04:10.784Z',
      from_pipeline: {name: 'New Issues'},
      to_pipeline: {name: 'Backlog'}
    }]
    nock('https://api.zenhub.io')
      .get('/p1/repositories/123/issues/4/events')
      .reply(200, JSON.stringify(expected))

    return getIssueEvents({repo_id: 123}, {number: 4})
      .then(data => tt.deepEqual(data, expected))
  })

  t.end()
})
