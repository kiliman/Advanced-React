import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import Router from 'next/router'
import gql from 'graphql-tag'
import Form from './styles/Form'
import ErrorMessage from './ErrorMessage'
import { CURRENT_USER_QUERY } from './User'

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
    }
  }
`

class Signin extends Component {
  state = {
    email: '',
    password: '',
  }

  handleChange = e => {
    const { name, type, value } = e.target
    const val = type === 'number' ? parseFloat(value) : value
    this.setState({ [name]: val })
  }

  handleSubmit = async (e, signin) => {
    e.preventDefault()
    const user = await signin()
    this.setState({ email: '', password: '' })
    if (user) {
      Router.push({
        pathname: '/me',
      })
    }
  }

  render() {
    return (
      <Mutation
        mutation={SIGNIN_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(signin, { loading, error }) => (
          <Form method="POST" onSubmit={e => this.handleSubmit(e, signin)}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Signin to Your Account</h2>
              <ErrorMessage error={error} />
              <label htmlFor="email">
                Email
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={this.state.email}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor="password">
                Password
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.handleChange}
                />
              </label>
              <button type="submit">Sign In!</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    )
  }
}

export default Signin
