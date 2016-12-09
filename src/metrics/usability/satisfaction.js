import config from 'config'
import {MongoClient as mongo} from 'mongodb'

import {getIssuesForRepo} from '../../fetchers/gitHub'
import {saveEvent} from '../../fetchers/keen'

export async function saveIssueMetrics() {
  const repoName = config.get('usability.repo')

  const [openIssues, closedIssues] = await Promise.all([
    getIssuesForRepo(repoName, {state: 'open'}),
    getIssuesForRepo(repoName, {state: 'closed'}),
  ])

  const keenEvents = _keenIssueCountEventsFor(repoName, openIssues, 'open')
    .concat(_keenIssueCountEventsFor(repoName, closedIssues, 'closed'))
  const writeKeenEvents = keenEvents.map(event => saveEvent('usability', 'losIssueCountsByLabel', event))
  await Promise.all(writeKeenEvents)
}

export async function saveSupportMetrics() {
  const mongoURL = config.get('usability.mongoURL')
  const channelName = 'support'
  const fromDate = new Date()
  fromDate.setUTCDate(fromDate.getUTCDate() - 1)

  const db = await mongo.connect(mongoURL)
  const [{_id: rid}] = await db.collection('rocketchat_room')
    .find({name: channelName}, {_id: true})
    .toArray()
  const count = await db.collection('rocketchat_message')
    .find({
      rid,
      ts: {
        $gte: fromDate,
      }
    })
    .count()

  const supportMessageCount = {
    channelName,
    count,
  }
  await saveEvent('usability', 'supportMessageCounts', supportMessageCount)
}

function _keenIssueCountEventsFor(repoName, issues, state) {
  const countsByLabel = issues
    .filter(issue => issue.labels.length > 0)
    .reduce((result, issue) => {
      issue.labels.forEach(({name: label}) => {
        if (!result[label]) {
          result[label] = 0
        }
        result[label] += 1
      })
      return result
    }, {})
  const keenEvents = Object.keys(countsByLabel)
    .map(label => ({
      label,
      repoName,
      state,
      count: countsByLabel[label],
    }))

  return keenEvents
}
