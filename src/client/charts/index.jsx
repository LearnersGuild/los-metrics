import React, {Component, PropTypes} from 'react'
import Keen from 'keen-js'

import KeenChart from './KeenChart'
import config from './config'
import styles from './index.css'

export default class Charts extends Component {
  render() {
    const sections = [{
      id: 'usability',
      charts: [
        'supportMessageCounts',
        'openIssueCounts',
        'closedIssueCounts',
        'unresolvedErrorCounts',
        'resolvedErrorCounts',
      ],
    }, {
      id: 'quality',
      charts: [
        'gpa',
        'coverage',
      ],
    }, {
      id: 'sentiment',
      charts: [
        'qualityPerAuthor',
        'overallQuality',
      ],
    }, {
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
    <div className={styles.section}>
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
    const client = new Keen(config.api.keen.projects[section])
    const {analysisType, arguments: args} = config.sections[section].charts[chartName].query
    const query = new Keen.Query(analysisType, args)
    const mergedChartOptions = {...config.charts.defaultOptions.chartOptions, ...props.chartOptions}
    const mergedOptions = {...config.charts.defaultOptions, ...props, chartOptions: mergedChartOptions}

    return (
      <KeenChart key={key} client={client} query={query} {...mergedOptions}/>
    )
  }
}
