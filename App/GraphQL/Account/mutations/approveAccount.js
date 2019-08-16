import gql from 'graphql-tag'
import session from '../fragments/session'

export default gql`
  mutation ApproveAccount(
    $id: ID!
  ) {
    activateAccount(
      id: $id
    ) {
      session {
        ... Session
      }
    }
  }
  ${session}
`
