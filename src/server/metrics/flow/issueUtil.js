export function assertRepo(repo) {
  if (!Object.prototype.hasOwnProperty.call(repo, 'repo_id')) {
    throw new TypeError('repos must have a "repo_id" attribute')
  }
  if (!Object.prototype.hasOwnProperty.call(repo, 'cached_repo_name')) {
    throw new TypeError('repos must have a "cached_repo_name" attribute')
  }
}

export function assertIssue(issue) {
  if (!Object.prototype.hasOwnProperty.call(issue, 'closed_at')) {
    throw new TypeError('issues must have a "closed_at" attribute')
  }
}

export function assertComposedIssue(issue) {
  if (!Object.prototype.hasOwnProperty.call(issue, 'closedAt')) {
    throw new TypeError('issues must have a "closedAt" attribute')
  }
  if (!Object.prototype.hasOwnProperty.call(issue, 'millisPerLane')) {
    throw new TypeError('composed issues must have a "millisPerLane" attribute')
  }
}

function orderedIssueTransferEvents(zhIssueEvents) {
  return zhIssueEvents
    .filter(event => event.type === 'transferIssue')
    .sort((a, b) => (
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    ))
}

function lanesToTransferTimes(xfers, attr) {
  return xfers.reduce((curr, xfer) => {
    const lane = xfer[attr].name
    if (!curr.has(lane)) {
      curr.set(lane, [])
    }
    curr.get(lane).push(new Date(xfer.created_at))
    return curr
  }, new Map())
}

export function millisPerLaneForIssue(newIssuesLane, ghIssue, zhIssueEvents) {
  assertIssue(ghIssue)
  const xfers = orderedIssueTransferEvents(zhIssueEvents)
  const lastLaneBeforeClosed = xfers.length ? xfers[xfers.length - 1].to_pipeline.name : newIssuesLane

  const lanesToStartTimes = lanesToTransferTimes(xfers, 'to_pipeline')
  // there's an additional start time for when the issue is first created
  const newIssueStartTime = new Date(ghIssue.created_at)
  lanesToStartTimes.set(newIssuesLane, lanesToStartTimes.has(newIssuesLane) ?
    [newIssueStartTime].concat(lanesToStartTimes.get(newIssuesLane)) :
    [newIssueStartTime])

  const lanesToEndTimes = lanesToTransferTimes(xfers, 'from_pipeline')
  // there's an additional end time for when the issue is closed
  if (ghIssue.closed_at) {
    const closedIssueEndTime = new Date(ghIssue.closed_at)
    lanesToEndTimes.set(lastLaneBeforeClosed, lanesToEndTimes.has(lastLaneBeforeClosed) ?
      lanesToEndTimes.get(lastLaneBeforeClosed).concat([closedIssueEndTime]) :
      [closedIssueEndTime])
  }

  const laneTimes = {}
  lanesToEndTimes.forEach((endTimes, lane) => {
    const startTimes = lanesToStartTimes.get(lane) || []
    if (!laneTimes[lane]) {
      laneTimes[lane] = 0
    }
    endTimes.forEach((date, i) => {
      const startDate = startTimes[i] || new Date(ghIssue.created_at)
      laneTimes[lane] += (date.getTime() - startDate.getTime())
    })
  })
  return laneTimes
}

export function composeIssue(newIssuesLane, repo, ghIssue, zhIssueEvents) {
  assertRepo(repo)
  assertIssue(ghIssue)
  return {
    repoId: repo.repo_id,
    repoName: repo.cached_repo_name,
    id: ghIssue.id,
    number: ghIssue.number,
    createdAt: ghIssue.created_at,
    closedAt: ghIssue.closed_at,
    updatedAt: ghIssue.updated_at,
    millisPerLane: millisPerLaneForIssue(newIssuesLane, ghIssue, zhIssueEvents),
    _ghIssue: ghIssue,
    _zhIssueEvents: zhIssueEvents
  }
}
