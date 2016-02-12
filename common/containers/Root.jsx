import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import signIn from '../actions/signIn'
import loadMetrics from '../actions/loadMetrics'

import Metrics from '../components/Metrics'
import SignIn from '../components/SignIn'

import styles from './Root.scss'


export class Root extends Component {
  componentDidMount() {
    this.constructor.fetchData(this.props.dispatch)
  }

  static fetchData(dispatch) {
    dispatch(loadMetrics())
  }

  render() {
    const { auth, metrics, dispatch } = this.props
    const content = auth.currentUser && auth.currentUser.idToken ? (
      <Metrics metrics={metrics} />
    ) : (
      <SignIn onSignIn={() => dispatch(signIn('google-oauth2'))} />
    )
    return (
      <div className={styles.root}>
        <div className="row">
          <section className={styles.content}>
            {content}
          </section>
        </div>
      </div>
    )
  }
}

Root.propTypes = {
  auth: PropTypes.shape({
    isSigningIn: PropTypes.bool.isRequired,
    currentUser: PropTypes.object,
  }),
  metrics: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    projects: PropTypes.array,
  }),
}

function select(state) {
  return {
    auth: state.auth,
    metrics: state.metrics,
  }
}

export default connect(select)(Root)
