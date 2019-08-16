import gql from 'graphql-tag'

export default gql`
  fragment User on User {
    _id
    displayName
    email
    photoEntry
  }
`
