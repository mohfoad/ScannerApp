import gql from 'graphql-tag'
import session from '../fragments/session'

export default gql`
  query Session {
    session {
      ... Session
    }
  }
  ${session}
`
