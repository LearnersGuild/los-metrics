import test from 'tape'

import {
  assertIssue,
  assertComposedIssue,
  millisPerLaneForIssue,
  composeIssue,
} from '../issueUtil'
import {
  zhRepo,
  gitHubIssueInProgress,
  zhIssueEventsInProgress,
} from './mocks'

/* eslint-disable camelcase */
test('metrics/flow/issueUtil', t => {
  const repo = zhRepo()
  const ghIssue = gitHubIssueInProgress()
  const zhIssueEvents = zhIssueEventsInProgress()
  const millisPerDay = 24 * 60 * 60 * 1000

  t.test('assertIssue', tt => {
    tt.test('throws a TypeError if an invalid issue is passed', ttt => {
      ttt.plan(3)
      ttt.throws(() => assertIssue(null), TypeError)
      ttt.throws(() => assertIssue({a: 1}), TypeError)
      ttt.doesNotThrow(() => assertIssue(ghIssue))
    })
  })

  t.test('assertComposedIssue', tt => {
    tt.test('throws a TypeError if an invalid composed issue is passed', ttt => {
      ttt.plan(3)
      ttt.throws(() => assertComposedIssue(undefined), TypeError)
      ttt.throws(() => assertComposedIssue({closedAt: '2016-04-01T00:00:00.000Z'}), TypeError)
      ttt.doesNotThrow(() => assertComposedIssue({closedAt: '2016-04-01T00:00:00.000Z', millisPerLane: {}}))
    })
  })

  t.test('millisPerLaneForIssue', tt => {
    tt.test('returns empty object if no issue events is passed', ttt => {
      ttt.plan(1)
      ttt.deepEqual(millisPerLaneForIssue(ghIssue, []), {})
    })

    tt.test('tallies the time in each lane', ttt => {
      ttt.plan(1)
      const expected = {
        'New Issues': millisPerDay,
        'Backlog': millisPerDay * 2,
        'In Progress': millisPerDay,
      }
      const timePerLane = millisPerLaneForIssue(ghIssue, zhIssueEvents)
      ttt.deepEqual(timePerLane, expected)
    })

    tt.end()
  })

  t.test('composeIssue', tt => {
    tt.test('consolidates the various pieces of issue information', ttt => {
      ttt.plan(1)
      const composedIssue = composeIssue(repo, ghIssue, zhIssueEvents)
      ttt.ok(Object.keys(composedIssue).includes('millisPerLane'), 'composeIssue should add "millisPerLane" attribute')
    })
  })

  t.end()
})
