/* eslint-disable no-undef */

jest.dontMock('../Metrics')
jest.dontMock('../ProjectMetrics')

import React from 'react'
import TestUtils from 'react-addons-test-utils'

const Metrics = require('../Metrics').default
const ProjectMetrics = require('../ProjectMetrics').default

const data = {
  isLoading: false,
  projects: [{
    name: 'My Project',
    metrics: {
      cycleTime: 1.23456,
      leadTime: 4.56789,
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

describe('Metrics', () => {
  const metrics = TestUtils.renderIntoDocument(
    <Metrics metrics={data} />
  )

  it('renders the correct number of projects', () => {
    const children = TestUtils.scryRenderedComponentsWithType(metrics, ProjectMetrics)
    expect(children.length).toEqual(data.projects.length)
  })
})
