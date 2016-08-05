/* eslint-disable camelcase */
import config from 'config'

import {
  assertComposedIssue,
} from './issueUtil'

const millisPerDay = 24 * 60 * 60 * 1000

function assertBoardInfo(boardInfo) {
  if (!boardInfo || !boardInfo.pipelines) {
    throw new TypeError('board info must have a "piplines" attribute')
  }
}

function boardLaneNames(boardInfo) {
  assertBoardInfo(boardInfo)
  return boardInfo.pipelines.map(p => p.name)
}

export function wip(boardInfo) {
  assertBoardInfo(boardInfo)
  const wipLaneNames = config.get('flow.wip.lanes')
  return boardInfo.pipelines.reduce((boardWipSum, lane) => {
    return wipLaneNames.includes(lane.name) ? boardWipSum + lane.issues.length : boardWipSum
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

export function cycleTimeForIssue(composedIssue, boardInfo) {
  assertComposedIssue(composedIssue)
  const cycleTimeStartLane = config.get('flow.cycleTime.startLane')
  return computeTimeForIssue(composedIssue, boardInfo, cycleTimeStartLane)
}

export function leadTimeForIssue(composedIssue, boardInfo) {
  assertComposedIssue(composedIssue)
  const leadTimeStartLane = config.get('flow.leadTime.startLane')
  return computeTimeForIssue(composedIssue, boardInfo, leadTimeStartLane)
}
