import PropTypes from 'prop-types'
import UpdateItem from '../components/UpdateItem'

const Update = ({ query }) => <UpdateItem id={query.id} />
Update.propTypes = {
  query: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
}

export default Update
