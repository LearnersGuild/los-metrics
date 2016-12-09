import {table} from '../../util/presenters'
import logErrorAndExit from '../../util/logErrorAndExit'
import {saveIssueMetrics, saveSupportMetrics} from './satisfaction'
import {getAnalysis} from '../../fetchers/keen'

async function getUsabilityMetrics() {
  const {result: issueCountsByRepoAndLabel} = await getAnalysis('usability', 'maximum', {
    eventCollection: 'losIssueCountsByLabel',
    targetProperty: 'count',
    timeframe: 'this_1_day',
    groupBy: ['repoName', 'label'],
  })

  return {
    issueCounts: issueCountsByRepoAndLabel.map(({repoName, label, result}) => ({repoName, label, issueCount: result})),
    supportMessageCount: NaN,
  }
}

async function run() {
  try {
    // satisfaction: save metrics about user-reported issues
    await saveIssueMetrics()

    // satisfaction: save metrics about users requesting support
    await saveSupportMetrics()

    // save and display roll-up metrics
    const usability = await getUsabilityMetrics()
    console.info('Issue Counts by Repository and Label:')
    console.info(table(usability.issueCounts, {includeHeaders: true}))
    console.info('\nNumber of #support messages in past day:', usability.supportMessageCount)
  } catch (err) {
    logErrorAndExit(err)
  }
}

if (!module.parent) {
  /* eslint-disable xo/no-process-exit */
  run().then(() => process.exit(0))
}
