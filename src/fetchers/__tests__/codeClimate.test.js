import test from 'blue-tape'
import nock from 'nock'

import {getRepositoryInfo, getRepositoryTestReports} from '../codeClimate'

/* eslint-disable camelcase */
test('fetchers/codeClimate', t => {
  t.test('getRepositoryInfo returns a Promise', tt => {
    tt.plan(1)

    const expected = {data: [{id: '123'}]}
    nock('https://api.codeclimate.com')
      .get('/v1/repos')
      .query({github_slug: 'LearnersGuild/foo'})
      .reply(200, JSON.stringify(expected))

    return getRepositoryInfo('LearnersGuild/foo')
      .then(data => tt.deepEqual(data, expected))
  })

  t.test('getRepositoryTestReports returns a Promise', tt => {
    tt.plan(1)

    /* eslint-disable camelcase */
    const expected = {data: [{attributes: {covered_percent: 95.4}}]}
    nock('https://api.codeclimate.com')
      .get('/v1/repos/123/test_reports')
      .query(() => true)
      .reply(200, JSON.stringify(expected))

    return getRepositoryTestReports('123')
      .then(data => tt.deepEqual(data, expected))
  })

  t.end()
})
