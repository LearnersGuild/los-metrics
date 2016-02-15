import React, {Component, PropTypes} from 'react'

import CircularProgress from 'material-ui/lib/circular-progress'
import Table from 'material-ui/lib/table/table'
import TableHeader from 'material-ui/lib/table/table-header'
import TableHeaderColumn from 'material-ui/lib/table/table-header-column'
import TableRow from 'material-ui/lib/table/table-row'
import TableBody from 'material-ui/lib/table/table-body'
import TableFooter from 'material-ui/lib/table/table-footer'
import TableRowColumn from 'material-ui/lib/table/table-row-column'

import ProjectMetrics from './ProjectMetrics'

export default class Metrics extends Component {
  render() {
    const {metrics} = this.props
    let content = <CircularProgress size={2} />
    if (!metrics.isLoading) {
      const tableRows = metrics.projects.map((project, i) => {
        return <ProjectMetrics key={i} project={project} />
      })

      const secondsPerDay = 60 * 60 * 24
      let meanCycleTime = metrics.projects.reduce((sum, project) => {
        return sum + project.metrics.cycleTime
      }, 0) / metrics.projects.length
      meanCycleTime = Math.round(meanCycleTime / secondsPerDay * 10) / 10
      let meanLeadTime = metrics.projects.reduce((sum, project) => {
        return sum + project.metrics.leadTime
      }, 0) / metrics.projects.length
      meanLeadTime = Math.round(meanLeadTime / secondsPerDay * 10) / 10
      const totalThroughput = metrics.projects.reduce((sum, project) => {
        return sum + project.metrics.throughput
      }, 0)
      const totalWip = metrics.projects.reduce((sum, project) => {
        return sum + project.metrics.wip
      }, 0)
      const summaryColStyle = {
        textAlign: 'left',
      }
      content = (
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
          <TableBody stripedRows>
            {tableRows}
          </TableBody>
          <TableFooter adjustForCheckbox={false}>
            <TableRow>
              <TableRowColumn style={{fontWeight: 'bold'}}>Summary</TableRowColumn>
              <TableRowColumn style={summaryColStyle}>{meanCycleTime}</TableRowColumn>
              <TableRowColumn>{meanLeadTime}</TableRowColumn>
              <TableRowColumn>{totalThroughput}</TableRowColumn>
              <TableRowColumn>{totalWip}</TableRowColumn>
            </TableRow>
          </TableFooter>
        </Table>
      )
    }

    return (
      <div>
        <h1>Product Metrics</h1>
        {content}
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
