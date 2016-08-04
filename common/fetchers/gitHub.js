import apiFetch from '../util/apiFetch'

function headers(apiToken) {
  return {
    Authorization: `token ${apiToken}`,
    Accept: 'application/vnd.github.v3+json',
  }
}

export function getRepo(repoName, apiToken = process.env.GITHUB_API_TOKEN) {
  const repoUrl = `https://api.github.com/repos/LearnersGuild/${repoName}`
  return apiFetch(repoUrl, {headers: headers(apiToken)})
}

export function getClosedIssuesForRepoSince(repoName, sinceDate, apiToken = process.env.GITHUB_API_TOKEN) {
  const issuesUrl = `https://api.github.com/repos/LearnersGuild/${repoName}/issues?state=closed&since=${sinceDate.toISOString()}`
  return apiFetch(issuesUrl, {headers: headers(apiToken)})
}
