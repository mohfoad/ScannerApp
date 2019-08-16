import gql from 'graphql-tag'
import session from '../fragments/session'

export default gql`
  mutation IssueAccountToken(
    $email: String!
  ) {
    issueAccountToken(
      email: $email
    ) {
      session {
        ... Session
      }
    }
  }
  ${session}
`
