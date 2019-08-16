import gql from 'graphql-tag'
import user from './user'

export default gql`
  fragment Session on Session {
    isAuthenticated
    user {
      ... User
    }
  }
  ${user}
`
