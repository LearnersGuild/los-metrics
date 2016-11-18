import test from 'blue-tape'
import nock from 'nock'

import {
  getLastEventForCollection,
  saveIssueMetrics,
} from '../keen'

/* eslint-disable camelcase */
test('fetchers/keen', t => {
  const now = new Date().toISOString()
  const mockIssue = {
    id: 582,
    owner: 'jeffreywescott',
    repo: 'game',
    cycleTime: 3.23,
    leadTime: 6.831,
    closedAt: now,
    keen: {timestamp: now},
  }

  t.test('getLastEventForCollection returns a Promise', tt => {
    tt.plan(1)

    nock('https://api.keen.io')
      .post('/3.0/projects/not-a-real-id/queries/extraction')
      .reply(200, JSON.stringify(mockIssue))

    return getLastEventForCollection('flow', 'issues')
      .then(data => tt.deepEqual(data, mockIssue))
  })

  t.test('saveIssueMetrics returns a Promise', tt => {
    const expected = {created: true}
    nock('https://api.keen.io')
      .post('/3.0/projects/not-a-real-id/events/issues')
      .reply(200, JSON.stringify(expected))

    return saveIssueMetrics(mockIssue)
      .then(data => tt.deepEqual(data, expected))
  })

  t.end()
})
