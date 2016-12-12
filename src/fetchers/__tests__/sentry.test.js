import test from 'blue-tape'
import nock from 'nock'

import {getProjects, getIssuesForProject} from '../sentry'

test('fetchers/sentry', t => {
  t.test('getProjects returns a Promise', tt => {
    tt.plan(1)

    const expected = [{
      status: 'active',
      id: '123',
      slug: 'my-project',
      name: 'My Project',
      organization: {
        id: '234',
        name: 'My Org',
        slug: 'my-org',
      }
    }]
    nock('https://sentry.io')
      .get('/api/0/projects/')
      .reply(200, JSON.stringify(expected))

    return getProjects()
      .then(data => tt.deepEqual(data, expected))
  })

  t.test('getIssuesForProject returns a Promise', tt => {
    tt.plan(1)

    const expected = [{
      userCount: 2,
      id: '345',
      title: 'this is an issue'
    }, {
      userCount: 2,
      id: '456',
      title: 'this is another issue'
    }]
    nock('https://sentry.io')
      .get('/api/0/projects/my-org/my-project/issues/?query=')
      .reply(200, JSON.stringify(expected))

    return getIssuesForProject('my-project', {query: ''})
      .then(data => tt.deepEqual(data, expected))
  })

  t.end()
})
