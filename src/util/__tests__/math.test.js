import test from 'tape'

import {median, mean, stdDev} from '../math'

test('util/math', t => {
  t.test('median', tt => {
    tt.test('throws an exception if not passed an array', ttt => {
      ttt.plan(1)
      ttt.throws(() => median('xyz'))
    })

    tt.test('returns the median value in the array', ttt => {
      ttt.plan(2)
      ttt.equal(median([2, 4, 6]), 4)
      ttt.equal(median([3, 5, 7, 9]), 6)
    })

    tt.end()
  })

  t.test('mean', tt => {
    tt.test('throws an exception if not passed an array', ttt => {
      ttt.plan(1)
      ttt.throws(() => mean({a: 1, b: 2}))
    })

    tt.test('returns the mean value in the array', ttt => {
      ttt.plan(1)
      ttt.equal(mean([1, 2, 3, 5, 8]), 3.8)
    })
  })

  t.test('stdDev', tt => {
    tt.test('throws an exception if not passed an array', ttt => {
      ttt.plan(1)
      ttt.throws(() => stdDev({a: 1, b: 2}))
    })

    tt.test('returns the standard deviation of the values in the array', ttt => {
      ttt.plan(1)
      const roundedStdDev = Math.round(stdDev([1, 2, 3, 5, 8]) * 100000) / 100000
      ttt.equal(roundedStdDev, 2.48193)
    })
  })

  t.end()
})
