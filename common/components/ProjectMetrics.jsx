import React, {Component, PropTypes} from 'react'

import TableRow from 'material-ui/lib/table/table-row'
import TableRowColumn from 'material-ui/lib/table/table-row-column'

export default class ProjectMetrics extends Component {
  render() {
    const {project} = this.props
    return (
      <TableRow displayRowCheckbox={false}>
        <TableRowColumn ref="name" style={{fontWeight: 'bold'}}>{project.name}</TableRowColumn>
        <TableRowColumn ref="cycleTime">{Math.round(project.metrics.cycleTime * 100) / 100}</TableRowColumn>
        <TableRowColumn ref="leadTime">{Math.round(project.metrics.leadTime * 100) / 100}</TableRowColumn>
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
  })
}
