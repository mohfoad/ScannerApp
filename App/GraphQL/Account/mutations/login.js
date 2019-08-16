import gql from 'graphql-tag'
import session from '../fragments/session'

export default gql`
  mutation Login(
    $email: String!,
    $password: String!
  ) {
    login(email: $email, password: $password) {
      ... Session
    }
  }
  ${session}
`
