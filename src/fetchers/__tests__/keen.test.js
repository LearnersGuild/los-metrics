import test from 'blue-tape'
import nock from 'nock'

import {
  saveEvent,
  getAnalysis,
} from '../keen'

/* eslint-disable camelcase */
test('fetchers/keen', t => {
  t.test('saveEvent returns a Promise', tt => {
    tt.plan(1)

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
    const result = {created: true}

    nock('https://api.keen.io')
      .post('/3.0/projects/not-a-real-id/events/issues')
      .reply(200, JSON.stringify(result))

    return saveEvent('flow', 'issues', mockIssue)
      .then(data => tt.deepEqual(data, result))
  })

  t.test('getAnalysis returns a Promise', tt => {
    tt.plan(1)

    const result = {result: 12.345}

    nock('https://api.keen.io')
      .post('/3.0/projects/not-a-real-id/queries/average')
      .reply(200, JSON.stringify(result))

    return getAnalysis('flow', 'average', {
      eventCollection: 'issues',
      targetProperty: 'leadTime',
      timeframe: 'this_1_month',
    })
      .then(data => tt.deepEqual(data, result))
  })

  t.end()
})
