import React, {Component} from 'react'

import Keen from 'keen-js'

export default class KeenChart extends React.Component {
  constructor(props) {
    super(props)
    this.initChart = this.initChart.bind(this)
  }

  initChart() {
    this._chart = new Keen.Dataviz()
      .el(this._chartRef)
      .chartType(this.props.chartType)
      .chartOptions(this.props.chartOptions)
      .prepare()
  }

  componentDidMount(){
    this.initChart()

    this.props.client.run(this.props.query, (err, res) => {
      if (err) {
        this._chart.error(err.message)
      } else {
        const data = res.result
        this._chart
          .parseRawData({result: data})
          .labelMapping(this.props.labelMapping)
          .labels(this.props.labels)
          .render()
      }
    })
  }

  render(){
    return(<div ref={(c) => this._chartRef = c}></div>);
  }
}

KeenChart.propTypes = {
  client: React.PropTypes.object.isRequired,
  query: React.PropTypes.object.isRequired,
  chartType: React.PropTypes.string.isRequired,
  labelMapping: React.PropTypes.object,
  labels: React.PropTypes.array,
  chartOptions: React.PropTypes.object,
}

KeenChart.defaultProps = {
  height: 400,
  width: 600,
  labelMapping: {},
  labels: [],
  chartOptions: {},
}
