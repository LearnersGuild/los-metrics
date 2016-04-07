import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import Snackbar from 'material-ui/lib/snackbar'

import clearErrors from '../actions/clearErrors'

import Metrics from './Metrics'

import styles from './Root.scss'

export class Root extends Component {
  handleErrorClose() {
    const {dispatch} = this.props
    dispatch(clearErrors())
  }

  componentDidMount() {
    /* global __CLIENT__ __DEVELOPMENT__ window */
    if (__CLIENT__) {
      const {auth} = this.props
      if (!auth.currentUser || !auth.lgJWT) {
        const baseURL = __DEVELOPMENT__ ? 'http://idm.learnersguild.dev' : 'https://idm.learnersguild.org'
        window.location.href = `${baseURL}/sign-in?redirect=${encodeURIComponent(window.location.href)}`
      }
    }
  }

  render() {
    const {errors} = this.props
    const errorBar = errors.message ? (
      <Snackbar
        open={Boolean(errors.message)}
        message={errors.message}
        onRequestClose={this.handleErrorClose.bind(this)}
        autoHideDuration={5000}
        />
    ) : ''

    return (
      <div>
        <section className={styles.content}>
          <Metrics />
        </section>
        {errorBar}
      </div>
    )
  }
}

Root.propTypes = {
  auth: PropTypes.shape({
    isBusy: PropTypes.bool.isRequired,
    lgJWT: PropTypes.string.isRequired,
    currentUser: PropTypes.object,
  }).isRequired,
  errors: PropTypes.shape({
    message: PropTypes.string,
  }),
  dispatch: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
    errors: state.errors,
  }
}

export default connect(mapStateToProps)(Root)
