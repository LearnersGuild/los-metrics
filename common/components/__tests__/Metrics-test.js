import test from 'ava'

import React from 'react'
import TestUtils from 'react-addons-test-utils'

const data = {
  isLoading: false,
  projects: [{
    name: 'My Project',
    metrics: {
      cycleTime: 1.23456 * 60 * 60 * 24,
      leadTime: 4.56789 * 60 * 60 * 24,
      throughput: 10,
      wip: 5,
    }
  }, {
    name: 'Another Project',
    metrics: {
      cycleTime: 2.34567,
      leadTime: 3.45678,
      throughput: 8,
      wip: 4,
    }
  }],
}

// test.before(() => {
// })

test('Metrics renders the correct number of projects', t => {
  t.plan(1)

  const Metrics = require('../Metrics')
  const ProjectMetrics = require('../ProjectMetrics')
  const metrics = TestUtils.renderIntoDocument(
    React.createElement(Metrics, {metrics: data})
  )
  const children = TestUtils.scryRenderedComponentsWithType(metrics, ProjectMetrics)
  t.is(children.length, data.projects.length)
})
