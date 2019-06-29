import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import styled from 'styled-components'
import Head from 'next/head'

import ErrorMessage from './ErrorMessage'
import { SINGLE_ITEM_QUERY } from './UpdateItem'

const SingleItemStyles = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  box-shadow: ${props => props.theme.bs};
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  min-height: 800px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .details {
    margin: 3rem;
    font-size: 2rem;
  }
`
class SingleItem extends Component {
  render() {
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
        {({ data, loading, error }) => {
          if (loading) return <p>Loading...</p>
          if (error) return <ErrorMessage error={error} />
          if (!data.item) return <p>Item not found!</p>
          const { item } = data

          return (
            <SingleItemStyles>
              <Head>
                <title>Sick Fits | {item.title}</title>
              </Head>
              <img src={item.largeImage} alt={item.title} />
              <div className="details">
                <h2>Viewing {item.title}</h2>
                <p>{item.description}</p>
              </div>
            </SingleItemStyles>
          )
        }}
      </Query>
    )
  }
}

SingleItem.propTypes = {
  id: PropTypes.string.isRequired,
}

export default SingleItem
