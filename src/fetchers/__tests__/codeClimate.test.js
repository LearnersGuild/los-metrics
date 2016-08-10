import test from 'blue-tape'
import nock from 'nock'

import {getRepositories, getRepositoryMetrics} from '../codeClimate'

test('fetchers/codeClimate', t => {
  t.test('getRepositoryIds returns a Promise', tt => {
    tt.plan(1)

    const expected = [{
      id: 'repo-id-1',
      url: 'ssh://git@github.com/LearnersGuild/repo-one.git',
      branch: 'master'
    }, {
      id: 'repo-id-2',
      url: 'ssh://git@github.com/LearnersGuild/repo-two.git',
      branch: 'master',
    }]
    nock('https://codeclimate.com')
      .get('/api/repos')
      .query(() => true)
      .reply(200, JSON.stringify(expected))

    return getRepositories()
      .then(data => tt.deepEqual(data, expected))
  })

  t.test('getRepositoryMetrics returns a Promise', tt => {
    tt.plan(1)

    /* eslint-disable camelcase */
    const expected = {
      id: 'im-an-id',
      account_id: 'im-an-account-id',
      name: 'im-a-repo-name',
      url: 'ssh://git@github.com/LearnersGuild/im-a-repo-name.git',
      branch: 'master',
      created_at: 1469730498,
      last_snapshot: {
        id: 'im-an-id',
        repo_id: 'im-a-repo-id',
        commit_sha: 'a1f525b3624f5e1972775cf3cc99b8f9d3ea2d9f',
        committed_at: 1470203076,
        finished_at: 1470203343,
        gpa: 3.45,
        covered_percent: 67.89,
        worker_version: 1234
      },
      previous_snapshot: {
        id: 'im-an-id',
        repo_id: 'im-a-repo-id',
        commit_sha: 'b1f525b3624f5e1972775cf3cc99b8f9d3ea2d9f',
        committed_at: 1460203076,
        finished_at: 1460203343,
        gpa: 3.21,
        covered_percent: 78.90,
        worker_version: 2345
      },
    }
    nock('https://codeclimate.com')
      .get('/api/repos/repo-id1')
      .query(() => true)
      .reply(200, JSON.stringify(expected))

    return getRepositoryMetrics('repo-id1')
      .then(data => tt.deepEqual(data, expected))
  })

  t.end()
})
