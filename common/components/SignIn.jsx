import React, {Component, PropTypes} from 'react'

import RaisedButton from 'material-ui/lib/raised-button'
import FontIcon from 'material-ui/lib/font-icon'

const styles = {
  button: {
    margin: 12,
  },
  div: {
    marginTop: 50,
  }
}

export default class SignIn extends Component {
  render() {
    return (
      <div style={styles.div}>
        <RaisedButton
          ref="signInButton"
          label="Sign-in Using Google"
          href="https://github.com/callemall/material-ui"
          onClick={this.props.onSignIn}
          primary
          style={styles.button}
          icon={<FontIcon className="fa fa-google"/>}
          />
      </div>
    )
  }
}

SignIn.propTypes = {
  onSignIn: PropTypes.func.isRequired,
}
