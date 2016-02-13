import React, {Component, PropTypes} from 'react'

import ProjectMetrics from './ProjectMetrics'

export default class Metrics extends Component {
  render() {
    const {metrics} = this.props
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
