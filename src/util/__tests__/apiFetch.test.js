import test from 'blue-tape'
import nock from 'nock'

import apiFetch from '../apiFetch'

test('util/apiFetch', t => {
  t.test('throws an APIError if unsuccessful', tt => {
    tt.plan(2)

    nock('https://api.example.com')
      .get('/some/path')
      .reply(401, 'Not Authorized')
      .get('/some/other/path')
      .reply(500, 'Internal Server Error')

    return Promise.all([
      tt.shouldFail(apiFetch('https://api.example.com/some/path')),
      tt.shouldFail(apiFetch('https://api.example.com/some/other/path')),
    ])
  })

  t.test('returns a Promise of data if successful', tt => {
    tt.plan(1)

    nock('https://api.example.com')
      .get('/yet/another/path')
      .reply(200, JSON.stringify({status: 'ok'}))

    return apiFetch('https://api.example.com/yet/another/path')
      .then(data => tt.deepEqual(data, {status: 'ok'}))
  })

  t.end()
})
