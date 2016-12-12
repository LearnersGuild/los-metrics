import {getProjects, getIssuesForProject} from '../../fetchers/sentry'
import {saveEvent} from '../../fetchers/keen'

export async function saveIssueMetrics() {
  const projects = await getProjects()
  const projectSlugs = projects.map(_ => _.slug)
  const fetchIssuesPromises = projectSlugs.map(projectSlug => getIssuesForProject(projectSlug, {query: '', statsPeriod: '24h'}))
  const projectsIssues = await Promise.all(fetchIssuesPromises)
  const keenEvents = projectSlugs.reduce((result, projectSlug, i) => {
    result = result.concat(_keenIssueCountEventsFor(projectSlug, projectsIssues[i]))
    return result
  }, [])

  const writeKeenEvents = keenEvents.map(event => saveEvent('usability', 'losErrorCountsByProject', event))
  await Promise.all(writeKeenEvents)
}

function _keenIssueCountEventsFor(projectSlug, issues) {
  const countsByStatus = issues
    .reduce((result, issue) => {
      if (!result[issue.status]) {
        result[issue.status] = 0
      }
      result[issue.status] += 1
      return result
    }, {})
  const keenEvents = Object.keys(countsByStatus)
    .map(status => ({
      status,
      projectSlug,
      count: countsByStatus[status],
    }))

  return keenEvents
}
