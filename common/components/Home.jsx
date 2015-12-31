import React, { Component } from 'react'

export default class Home extends Component {
  render() {
    return (
      <div>
        <div className="display-3">Product Metrics</div>
        <div>
          <a className="btn btn-primary" href="/docs/#!/default">View API Docs</a>
        </div>
      </div>
    )
  }
}
