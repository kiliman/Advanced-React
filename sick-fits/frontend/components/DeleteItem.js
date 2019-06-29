import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import { ALL_ITEMS_QUERY } from './Items'

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`
class DeleteItem extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    children: PropTypes.node,
  }

  handleClick = (e, deleteItem) => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteItem()
    }
  }

  update = (cache, payload) => {
    // manually update the cache on the client so it matches the server
    // 1. Read the cache for the items we want
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY })
    // 2. Filter the deleted item out of the cache
    data.items = data.items.filter(
      item => item.id !== payload.data.deleteItem.id,
    )
    // 3. Put the items back
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data })
  }
  render() {
    return (
      <Mutation
        mutation={DELETE_ITEM_MUTATION}
        variables={{ id: this.props.id }}
        update={this.update}
      >
        {(deleteItem, { error }) => {
          return (
            <button onClick={e => this.handleClick(e, deleteItem)}>
              {this.props.children}
            </button>
          )
        }}
      </Mutation>
    )
  }
}

export default DeleteItem
