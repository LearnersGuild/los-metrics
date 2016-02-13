import React, {Component, PropTypes} from 'react'

import Table from 'material-ui/lib/table/table'
import TableHeader from 'material-ui/lib/table/table-header'
import TableHeaderColumn from 'material-ui/lib/table/table-header-column'
import TableRow from 'material-ui/lib/table/table-row'
import TableBody from 'material-ui/lib/table/table-body'

import ProjectMetrics from './ProjectMetrics'

export default class Metrics extends Component {
  render() {
    const {metrics} = this.props
    const tableRows = metrics.projects.map((project, i) => {
      return <ProjectMetrics key={i} project={project} />
    })

    return (
      <div>
        <h1>Product Metrics</h1>
        <Table>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn>Project</TableHeaderColumn>
              <TableHeaderColumn>Cycle Time<br/> (days)</TableHeaderColumn>
              <TableHeaderColumn>Lead Time<br/> (days)</TableHeaderColumn>
              <TableHeaderColumn>Throughput<br/> (tasks)</TableHeaderColumn>
              <TableHeaderColumn>Work In-Progress<br/> (tasks)</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableRows}
          </TableBody>
        </Table>
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
