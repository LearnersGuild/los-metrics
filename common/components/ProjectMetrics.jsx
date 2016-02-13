import React, {Component, PropTypes} from 'react'

import TableRow from 'material-ui/lib/table/table-row'
import TableRowColumn from 'material-ui/lib/table/table-row-column'

export default class ProjectMetrics extends Component {
  render() {
    const {project, striped} = this.props
    const secondsPerDay = 60 * 60 * 24
    const cycleTime = Math.round(project.metrics.cycleTime / secondsPerDay * 10) / 10
    const leadTime = Math.round(project.metrics.leadTime / secondsPerDay * 10) / 10
    return (
      <TableRow striped={striped} displayRowCheckbox={false}>
        <TableRowColumn ref="name" style={{fontWeight: 'bold'}}>{project.name}</TableRowColumn>
        <TableRowColumn ref="cycleTime">{cycleTime}</TableRowColumn>
        <TableRowColumn ref="leadTime">{leadTime}</TableRowColumn>
        <TableRowColumn ref="throughput">{project.metrics.throughput}</TableRowColumn>
        <TableRowColumn ref="wip">{project.metrics.wip}</TableRowColumn>
      </TableRow>
    )
  }
}

ProjectMetrics.propTypes = {
  project: PropTypes.shape({
    name: PropTypes.string.isRequired,
    metrics: PropTypes.object.isRequired,
  }),
  striped: PropTypes.bool,
}
