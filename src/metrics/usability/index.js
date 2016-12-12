import {table} from '../../util/presenters'
import logErrorAndExit from '../../util/logErrorAndExit'
import {getAnalysis} from '../../fetchers/keen'

import {saveIssueMetrics, saveSupportMetrics} from './satisfaction'
import {saveIssueMetrics as saveErrorMetrics} from './effectiveness'

async function getUsabilityMetrics() {
  const {result: issueCountsByRepoAndLabel} = await getAnalysis('usability', 'maximum', {
    eventCollection: 'losIssueCountsByLabel',
    targetProperty: 'count',
    timeframe: 'this_1_day',
    groupBy: ['repoName', 'label', 'state'],
  })

  const {result: errorCountsByProjectAndStatus} = await getAnalysis('usability', 'maximum', {
    eventCollection: 'losErrorCountsByProject',
    targetProperty: 'count',
    timeframe: 'this_1_day',
    groupBy: ['projectSlug', 'status'],
  })

  const {result: supportMessageCount} = await getAnalysis('usability', 'maximum', {
    eventCollection: 'supportMessageCounts',
    targetProperty: 'count',
    timeframe: 'this_1_day',
  })

  return {
    issueCounts: issueCountsByRepoAndLabel.map(({repoName, label, state, result}) => ({
      repoName,
      label,
      state,
      issueCount: result,
    })),
    errorCounts: errorCountsByProjectAndStatus.map(({projectSlug, status, result}) => ({
      projectSlug,
      status,
      errorCount: result,
    })),
    supportMessageCount,
  }
}

async function run() {
  try {
    // satisfaction: save metrics about user-reported issues
    await saveIssueMetrics()

    // satisfaction: save metrics about users requesting support
    await saveSupportMetrics()

    // effectiveness: save metrics about number of unresolved errors
    await saveErrorMetrics()

    // save and display roll-up metrics
    const usability = await getUsabilityMetrics()
    console.info('Issue Counts by Repository and Label:')
    console.info(table(usability.issueCounts, {includeHeaders: true}))
    console.info('\nError Counts by Project and Status:')
    console.info(table(usability.errorCounts, {includeHeaders: true}))
    console.info('\nNumber of #support messages in past day:', usability.supportMessageCount)
  } catch (err) {
    logErrorAndExit(err)
  }
}

if (!module.parent) {
  /* eslint-disable xo/no-process-exit */
  run().then(() => process.exit(0))
}
