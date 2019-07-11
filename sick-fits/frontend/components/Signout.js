import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import Router from 'next/router'
import gql from 'graphql-tag'
import { CURRENT_USER_QUERY } from './User'

const SIGNOUT_MUTATION = gql`
  mutation SIGNOUT_MUTATION {
    signout {
      message
    }
  }
`

class Signout extends Component {
  handleClick = async (e, signout) => {
    e.preventDefault()
    await signout()
    Router.push({
      pathname: '/signup',
    })
  }

  render() {
    return (
      <Mutation
        mutation={SIGNOUT_MUTATION}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {signout => <a onClick={e => this.handleClick(e, signout)}>Sign out</a>}
      </Mutation>
    )
  }
}

export default Signout
