import PropTypes from 'prop-types'
import SingleItem from '../components/SingleItem'

const Item = ({ query }) => <SingleItem id={query.id} />
Item.propTypes = {
  query: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
}

export default Item
