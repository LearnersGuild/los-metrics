import test from 'tape'

import {table} from '../presenters'

test('util/presenters', t => {
  t.test('table', tt => {
    tt.test('throws an exception if not passed an array or object', ttt => {
      ttt.plan(3)
      ttt.throws(() => table('xyz'))
      ttt.doesNotThrow(() => table({a: 1}))
      ttt.doesNotThrow(() => table([{a: 1}]))
    })

    tt.test('returns a header row only when requested', ttt => {
      ttt.plan(2)
      ttt.equal(table({a: 1}, {includeHeaders: true}), 'a\n1')
      ttt.equal(table({a: 1}, {includeHeaders: false}), '1')
    })

    tt.test('uses the provided delimiters', ttt => {
      ttt.plan(2)
      ttt.equal(table({a: 1, b: 2}, {colDelimiter: ','}), '1,2')
      ttt.equal(table({a: 1, b: 2}, {rowDelimiter: '\r\n', includeHeaders: true}), 'a\tb\r\n1\t2')
    })

    tt.test('returns a row for each element in the array', ttt => {
      ttt.plan(2)
      const rows = table([{a: 1, b: 2}, {a: 3, b: 4}]).split('\n')
      ttt.equal(rows.length, 2)
      const rowsWithHeaders = table([{a: 1, b: 2}, {a: 3, b: 4}], {includeHeaders: true}).split('\n')
      ttt.equal(rowsWithHeaders.length, 3)
    })

    tt.end()
  })

  t.end()
})
