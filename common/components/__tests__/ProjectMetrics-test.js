import test from 'ava'

import React from 'react'
import TestUtils from 'react-addons-test-utils'

const data = {
  name: 'My Project',
  metrics: {
    cycleTime: 1.23456 * 60 * 60 * 24,
    leadTime: 4.56789 * 60 * 60 * 24,
    throughput: 10,
    wip: 5,
  }
}

// test.before(() => {
// })

test('ProjectMetrics renders the correctly formatted data', t => {
  t.plan(1)

  const ProjectMetrics = require('../ProjectMetrics')
  const renderer = TestUtils.createRenderer()
  renderer.render(
    React.createElement(ProjectMetrics, {project: data})
  )
  const projectMetrics = renderer.getRenderOutput()

  const values = projectMetrics.props.children.map(child => {
    return child.props.children
  })
  t.same(values, ['My Project', 1.2, 4.6, 10, 5])
})
