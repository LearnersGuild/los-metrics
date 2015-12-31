import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { signIn } from '../actions'

import Home from '../components/Home'
import SignIn from '../components/SignIn'

import styles from './Root.scss'

export class Root extends Component {
  render() {
    const content = this.props.auth.currentUser ? (
      <Home />
    ) : (
      <SignIn onSignIn={() => this.props.dispatch(signIn('google-oauth2'))} />
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
  })
}

function select(state) {
  return {
    auth: state.auth,
  }
}

export default connect(select)(Root)
