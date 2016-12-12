import test from 'tape'

import {median, mean, stdDev, weightedMean} from '../math'

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

  t.test('weightedMean', tt => {
    tt.test('throws an exception if two arrays are not passed', ttt => {
      ttt.plan(2)
      ttt.throws(() => weightedMean({a: 1, b: 2}, [1, 2]))
      ttt.throws(() => weightedMean([1, 2], {a: 1, b: 2}))
    })

    tt.test('returns the weighted mean of the values in the first argument according to the weights in the second argument', ttt => {
      ttt.plan(2)

      const values1 = [10, 20, 30, 40]
      const weights1 = [0.25, 0.25, 0.25, 0.25]
      const wm1 = weightedMean(values1, weights1)
      ttt.equal(wm1, 25)

      const values2 = [3.0, 3.4, 3.8]
      const weights2 = [0.50, 0.25, 0.25]
      const wm2 = weightedMean(values2, weights2)
      ttt.equal(wm2, 3.3)
    })
  })

  t.end()
})
