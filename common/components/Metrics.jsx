import React, { Component, PropTypes } from 'react'

export class ProjectMetrics extends Component {
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

export default class Metrics extends Component {
  render() {
    const { metrics } = this.props
    const tableRows = metrics.projects.map((project, i) => {
      return <ProjectMetrics key={i} project={project} />
    })

    return (
      <div>
        <div className="display-3">Product Metrics</div>
        <table className="table table-striped">
          <thead className="thead-inverse">
            <tr>
              <th>Project</th>
              <th>Cycle Time<br/> (days)</th>
              <th>Lead Time<br/> (days)</th>
              <th>Throughput<br/> (tasks)</th>
              <th>Work In-Progress<br/> (tasks)</th>
            </tr>
          </thead>
          <tbody>
            {tableRows}
          </tbody>
        </table>
        <div>
          <a className="btn btn-primary" href="/docs/#!/default">View API Docs</a>
        </div>
      </div>
    )
  }
}

Metrics.propTypes = {
  metrics: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    projects: PropTypes.array,
  }),
}
