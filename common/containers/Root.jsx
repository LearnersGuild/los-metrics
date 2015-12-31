import React from 'react'
import { connect } from 'react-redux'
import { pushPath } from 'redux-simple-router'

import styles from './Root.scss'

export class Root extends React.Component {
  render() {
    return (
      <div className={`${styles.root} container-fluid`}>
        <div className="row">
          <section className="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
            <div className="display-3">Product Metrics</div>
            <div>
              <a className="btn btn-primary" href="/docs/#!/default">View API Docs</a>
              <a className="btn btn-primary" onClick={() => this.props.dispatch(pushPath('/example'))}>Example</a>
            </div>
          </section>
        </div>
      </div>
    )
  }
}

export default connect()(Root)
