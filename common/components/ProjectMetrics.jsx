import React, { Component, PropTypes } from 'react'

export default class ProjectMetrics extends Component {
  render() {
    const { project } = this.props
    return (
      <tr>
        <th ref="name" scope="row">{project.name}</th>
        <td ref="cycleTime">{Math.round(project.metrics.cycleTime * 100) / 100}</td>
        <td ref="leadTime">{Math.round(project.metrics.leadTime * 100) / 100}</td>
        <td ref="throughput">{project.metrics.throughput}</td>
        <td ref="wip">{project.metrics.wip}</td>
      </tr>
    )
  }
}

ProjectMetrics.propTypes = {
  project: PropTypes.shape({
    name: PropTypes.string.isRequired,
    metrics: PropTypes.object.isRequired,
  })
}
