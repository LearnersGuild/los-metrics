import React, {Component, PropTypes} from 'react'

export default class SignIn extends Component {
  render() {
    return (
      <div>
        <div className="display-3">Sign-in</div>
        <div>
          <button ref="signInButton" className="btn btn-primary" onClick={this.props.onSignIn}>
            <i className="fa fa-google" />
            <span>{" "}Sign-in Using Google</span>
          </button>
        </div>
      </div>
    )
  }
}

SignIn.propTypes = {
  onSignIn: PropTypes.func.isRequired,
}
