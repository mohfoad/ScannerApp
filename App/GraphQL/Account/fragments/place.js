import gql from 'graphql-tag'

export default gql`
  fragment Place on Place {
    _id
    description
    type
    location {
      googleID
      dateAdded
      lastUpdated
    }
    lastUpdated
    dateAdded
  }
`
