import gql from 'graphql-tag'

module.exports = gql`
    fragment PhotoEntryConfig on PhotoEntryConfig{
      date
      tags
      upc
    }
`
