import gql from 'graphql-tag'
import session from '../fragments/session'

export default gql`
  mutation Logout {
    logout {
      ... Session
    }
  }
  ${session}
`
