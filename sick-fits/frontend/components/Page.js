import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Page extends Component {
  render() {
    return (
      <div>
        <p>Hey I'm the Page Component</p>
        {this.props.children}
      </div>
    )
  }
}
Page.propTypes = {
  children: PropTypes.node.isRequired,
}
