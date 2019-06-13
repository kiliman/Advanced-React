import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Meta from './Meta'
import Header from './Header'

export default class Page extends Component {
  render() {
    return (
      <div>
        <Meta />
        <Header />
        {this.props.children}
      </div>
    )
  }
}
Page.propTypes = {
  children: PropTypes.node.isRequired,
}
