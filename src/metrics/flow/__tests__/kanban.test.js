import test from 'tape'

import {
  composeIssue,
} from '../issueUtil'
import {
  wip,
  cycleTimeForIssue,
  leadTimeForIssue,
} from '../kanban'
import {
  zhRepo,
  zenHubBoardInfo,
  gitHubIssueCompleted,
  gitHubIssueInProgress,
  zhIssueEventsCompleted,
  zhIssueEventsInProgress,
} from './mocks'

/* eslint-disable camelcase */
test('metrics/flow/kanban', t => {
  const boardInfo = zenHubBoardInfo()

  t.test('wip', tt => {
    tt.test('throws a TypeError if an invalid board is passed', ttt => {
      ttt.plan(1)
      ttt.throws(() => wip({a: 1}), TypeError)
    })

    tt.test('counts the number of issues in prt.ogress', ttt => {
      ttt.plan(1)
      ttt.equal(wip(boardInfo), 11)
    })
  })

  t.test('cycleTimeForIssue', tt => {
    tt.test('throws a TypeError if an invalid composed issue is passed', ttt => {
      ttt.plan(1)
      ttt.throws(() => cycleTimeForIssue({closed_at: '2016-04-01T00:00:00.000Z'}, boardInfo), TypeError)
    })

    tt.test('returns 0 if the issue is not complete', ttt => {
      ttt.plan(1)
      const composedIssue = composeIssue(zhRepo(), gitHubIssueInProgress(), zhIssueEventsInProgress())
      ttt.equal(cycleTimeForIssue(composedIssue, boardInfo), 0, 'incomplete issues have no cycle time')
    })

    tt.test('returns the cycle time for the issue', ttt => {
      ttt.plan(1)
      const composedIssue = composeIssue(zhRepo(), gitHubIssueCompleted(), zhIssueEventsCompleted())
      ttt.equal(cycleTimeForIssue(composedIssue, boardInfo), 3)
    })

    tt.end()
  })

  t.test('leadTimeForIssue', tt => {
    tt.test('throws a TypeError if an invalid composed issue is passed', ttt => {
      ttt.plan(1)
      ttt.throws(() => leadTimeForIssue({closed_at: '2016-04-01T00:00:00.000Z'}, boardInfo), TypeError)
    })

    tt.test('returns 0 if the issue is not complete', ttt => {
      ttt.plan(1)
      const composedIssue = composeIssue(zhRepo(), gitHubIssueInProgress(), zhIssueEventsInProgress())
      ttt.equal(leadTimeForIssue(composedIssue, boardInfo), 0, 'incomplete issues have no lead time')
    })

    tt.test('returns the lead time for the issue', ttt => {
      ttt.plan(1)
      const composedIssue = composeIssue(zhRepo(), gitHubIssueCompleted(), zhIssueEventsCompleted())
      ttt.equal(leadTimeForIssue(composedIssue, boardInfo), 6)
    })

    tt.end()
  })

  t.end()
})
