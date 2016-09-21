/* eslint-disable camelcase */
import {
  assertComposedIssue,
} from './issueUtil'

const millisPerDay = 24 * 60 * 60 * 1000

function assertBoardInfo(boardInfo) {
  if (!boardInfo || !boardInfo.pipelines) {
    throw new TypeError('board info must have a "pipelines" attribute')
  }
}

function boardLaneNames(boardInfo) {
  assertBoardInfo(boardInfo)
  return boardInfo.pipelines.map(p => p.name)
}

export function wip(wipLaneNames, boardInfo, prIssueNumbers = []) {
  assertBoardInfo(boardInfo)
  return boardInfo.pipelines.reduce((boardWipSum, lane) => {
    const nonPRIssuesInLane = lane.issues.filter(({issue_number}) => !prIssueNumbers.includes(issue_number))
    return wipLaneNames.includes(lane.name) ? boardWipSum + nonPRIssuesInLane.length : boardWipSum
  }, 0)
}

function computeTimeForIssue(composedIssue, boardInfo, startLane) {
  assertBoardInfo(boardInfo)
  if (!composedIssue.closedAt) {
    return 0
  }
  const allLaneNames = boardLaneNames(boardInfo)
  const sliceIdx = allLaneNames.findIndex(laneName => laneName === startLane)
  const relevantLaneNames = allLaneNames.slice(sliceIdx)
  return relevantLaneNames.reduce((curr, laneName) => {
    const millisInLane = composedIssue.millisPerLane[laneName] || 0
    return curr + millisInLane
  }, 0) / millisPerDay
}

export function cycleTimeForIssue(cycleTimeStartLane, composedIssue, boardInfo) {
  assertComposedIssue(composedIssue)
  const cycleTime = computeTimeForIssue(composedIssue, boardInfo, cycleTimeStartLane)
  return cycleTime
}

export function leadTimeForIssue(leadTimeStartLane, composedIssue, boardInfo) {
  assertComposedIssue(composedIssue)
  const leadTime = computeTimeForIssue(composedIssue, boardInfo, leadTimeStartLane)
  return leadTime
}
