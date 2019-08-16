import gql from 'graphql-tag'
import session from '../fragments/session'

export default gql`
  mutation ActivateAccount(
    $id: ID!,
    $token: String!
  ) {
    activateAccount(
      id: $id,
      token: $token
    ) {
      session {
        ... Session
      }
    }
  }
  ${session}
`
