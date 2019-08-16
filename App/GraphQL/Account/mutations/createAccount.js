import gql from 'graphql-tag'
import session from '../fragments/session'

export default gql`
  mutation CreateAccount(
    $displayName: String,
    $email: String!,
    $password: String!,
    $type: String,
  ) {
    createAccount(
      displayName: $displayName,
      email: $email,
      password: $password,
      type: $type
    ) {
      ... Session
    }
  }
  ${session}
`
