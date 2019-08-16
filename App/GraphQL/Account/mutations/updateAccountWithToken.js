import gql from 'graphql-tag'
import session from '../fragments/session'

export default gql`
  mutation UpdateAccountWithToken(
    $id: String!,
    $password: String!,
    $token: String!
  ) {
    updateAccountWithToken(
      id: $id,
      password: $password,
      token: $token
    ) {
      session {
        ... Session
      }
    }
  }
  ${session}
`
