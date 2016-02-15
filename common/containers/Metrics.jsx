import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import loadMetrics from '../actions/loadMetrics'
import MetricsComponent from '../components/Metrics'

class Metrics extends Component {
  componentDidMount() {
    this.constructor.fetchData(this.props.dispatch)
  }

  static fetchData(dispatch) {
    dispatch(loadMetrics())
  }

  render() {
    const {metrics} = this.props
    return (
      <MetricsComponent metrics={metrics} />
    )
  }
}

Metrics.propTypes = {
  metrics: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    projects: PropTypes.array,
  }),
  dispatch: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  return {
    metrics: state.metrics,
  }
}

export default connect(mapStateToProps)(Metrics)
