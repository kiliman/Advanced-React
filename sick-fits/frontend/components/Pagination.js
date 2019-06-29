import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Head from 'next/head'
import Link from 'next/link'

import { perPage } from '../config'

import PaginationStyles from './styles/PaginationStyles'

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`

const Pagination = ({ page }) => (
  <Query query={PAGINATION_QUERY}>
    {({ data, loading }) => {
      if (loading) return <p>Loading...</p>
      const count = data.itemsConnection.aggregate.count
      const pages = Math.ceil(count / perPage)
      page = page > pages ? pages : page
      return (
        <PaginationStyles>
          <Head>
            <title>
              Sick Fits! - Page {page} of {pages}
            </title>
          </Head>
          <Link
            prefetch
            href={{
              pathname: '/items',
              query: { page: page - 1 },
            }}
          >
            <a className="prev" aria-disabled={page <= 1}>
              ← Prev
            </a>
          </Link>
          <p>
            Page {page} of {pages}
          </p>
          <p>
            {count} Item{count > 1 ? 's' : ''} Total
          </p>
          <Link
            prefetch
            href={{
              pathname: '/items',
              query: { page: page + 1 },
            }}
          >
            <a className="next" aria-disabled={page >= pages}>
              Next →
            </a>
          </Link>
        </PaginationStyles>
      )
    }}
  </Query>
)

Pagination.propTypes = {
  page: PropTypes.number,
}
export default Pagination
