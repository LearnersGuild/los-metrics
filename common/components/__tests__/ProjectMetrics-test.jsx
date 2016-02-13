/* eslint-disable no-undef */

jest.dontMock('../ProjectMetrics')

import React from 'react'
import TestUtils from 'react-addons-test-utils'

const ProjectMetrics = require('../ProjectMetrics').default

const data = {
  name: 'My Project',
  metrics: {
    cycleTime: 1.23456,
    leadTime: 4.56789,
    throughput: 10,
    wip: 5,
  }
}

describe('ProjectMetrics', () => {
  const renderer = TestUtils.createRenderer()
  renderer.render(
    <ProjectMetrics project={data} />
  )
  const projectMetrics = renderer.getRenderOutput()

  it('renders the correctly formatted data', () => {
    const values = projectMetrics.props.children.map(child => {
      return child.props.children
    })
    expect(values).toEqual(['My Project', 1.23, 4.57, 10, 5])
  })
})
