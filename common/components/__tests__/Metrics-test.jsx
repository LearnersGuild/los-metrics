/* eslint-disable no-undef */

jest.dontMock('../Metrics')

import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'

const Metrics = require('../Metrics').default
const ProjectMetrics = require('../Metrics').ProjectMetrics

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

  it('links to the API docs', () => {
    const metricsNode = ReactDOM.findDOMNode(metrics)
    expect(metricsNode.textContent).toContain('View API Docs')
  })

  it('renders the correct number of projects', () => {
    const children = TestUtils.scryRenderedComponentsWithType(metrics, ProjectMetrics)
    expect(children.length).toEqual(data.projects.length)
  })
})

describe('ProjectMetrics', () => {
  const renderer = TestUtils.createRenderer()
  renderer.render(
    <ProjectMetrics project={data.projects[0]} />
  )
  const projectMetrics = renderer.getRenderOutput()

  it('renders the correctly formatted data', () => {
    const values = projectMetrics.props.children.map((child) => {
      return child.props.children
    })
    expect(values).toEqual([ 'My Project', 1.23, 4.57, 10, 5 ])
  })
})
