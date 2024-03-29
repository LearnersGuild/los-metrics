import test from 'blue-tape'
import nock from 'nock'

import {getRepo, getIssuesForRepo} from '../gitHub'

test('fetchers/gitHub', t => {
  t.test('getRepo returns a Promise', tt => {
    tt.plan(1)

    /* eslint-disable camelcase */
    const expected = {
      id: 123,
      name: 'some-repo',
      full_name: 'LearnersGuild/some-repo',
    }
    nock('https://api.github.com')
      .get('/repos/LearnersGuild/some-repo')
      .reply(200, JSON.stringify(expected))

    return getRepo('some-repo')
      .then(data => tt.deepEqual(data, expected))
  })

  t.test('getIssuesForRepo returns a Promise', tt => {
    tt.plan(1)

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    /* eslint-disable camelcase */
    const expected = [{
      url: 'https://api.github.com/repos/LearnersGuild/some-repo/issues/1',
      id: 123,
      number: 1,
      title: 'Issue Numero Uno',
    }, {
      url: 'https://api.github.com/repos/LearnersGuild/some-repo/issues/2',
      id: 234,
      number: 2,
      title: 'Issue Numero Dos',
    }]
    nock('https://api.github.com')
      .get(`/repos/LearnersGuild/some-repo/issues?since=${encodeURIComponent(yesterday.toISOString())}&state=closed`)
      .reply(200, JSON.stringify(expected))

    return getIssuesForRepo('some-repo', {state: 'closed', since: yesterday.toISOString()})
      .then(data => tt.deepEqual(data, expected))
  })

  t.end()
})
