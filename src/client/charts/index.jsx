import React, {Component, PropTypes} from 'react'
import keen from 'keen-js'
import KeenChart from 'react-keenio'

import config from './config'

export default class Charts extends Component {
  render() {
    const sections = [{
      id: 'flow',
      charts: [
        'throughput',
        'cycleTime',
        'leadTime',
        'wip',
      ],
    }]
    const sectionComponents = sections.map(section => (
      <ChartSection
        key={`section-${section.id}`}
        {...section}
        />
    ))

    return (
      <div>
        {sectionComponents}
      </div>
    )
  }
}

const ChartSection = props => {
  const {id, charts} = props
  const chartComponents = charts.map(chart => {
    const key = `chart-${id}-${chart}`
    const renderChart = _getRenderChart(id, chart, key)
    return renderChart(config.sections[id].charts[chart].options)
  })

  return (
    <div>
      <h2>{config.sections[id].title}</h2>
      <div>
        {chartComponents}
      </div>
      <hr/>
    </div>
  )
}
ChartSection.propTypes = {
  id: PropTypes.string.isRequired,
  charts: PropTypes.array.isRequired,
}

function _getRenderChart(section, chartName, key) {
  return props => {
    console.log({props})
    const client = new Keen(config.api.keen.projects[section])
    const {analysisType, arguments: args} = config.sections[section].charts[chartName].query
    const query = new Keen.Query(analysisType, args)

    return (
      <KeenChart key={key} client={client} query={query} {...config.charts.defaultOptions} {...props}/>
    )
  }
}
