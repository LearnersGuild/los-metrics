import React from 'react'
import { connect } from 'react-redux'
import { pushPath } from 'redux-simple-router'

import styles from './Root.scss'

export class Root extends React.Component {
  render() {
    return (
      <div className={styles.root}>
        <div className="row">
          <section className={styles.content}>
            <div className="display-3">Product Metrics</div>
            <div>
              <a className={styles.btn} href="/docs/#!/default">View API Docs</a>
              <a className={styles.btn} onClick={() => this.props.dispatch(pushPath('/example'))}>Example</a>
            </div>
          </section>
        </div>
      </div>
    )
  }
}

export default connect()(Root)
