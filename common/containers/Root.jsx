import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import Snackbar from 'material-ui/lib/snackbar'

import clearErrors from '../actions/clearErrors'
import signIn from '../actions/signIn'

import SignIn from '../components/SignIn'
import Metrics from './Metrics'

import styles from './Root.scss'

export class Root extends Component {
  handleErrorClose() {
    const {dispatch} = this.props
    dispatch(clearErrors())
  }

  render() {
    const {auth, errors, dispatch} = this.props
    const content = auth.currentUser && auth.currentUser.idToken ? (
      <Metrics />
    ) : (
      <SignIn onSignIn={() => dispatch(signIn('google-oauth2'))} />
    )
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
          {content}
        </section>
        {errorBar}
      </div>
    )
  }
}

Root.propTypes = {
  auth: PropTypes.shape({
    isSigningIn: PropTypes.bool.isRequired,
    currentUser: PropTypes.object,
  }),
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
