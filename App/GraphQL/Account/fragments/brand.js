import gql from 'graphql-tag'
import place from './place'

export default gql`
  fragment Brand on Brand {
    _id
    name
    slug
    about
    website
    category
    headquarters {
      ... Place
    }
    contact {
      email {
        address
        verified
      }
    }
    social {
      twitter
      facebook
      instagram
    }
    logo {
      _id
    }
  }
  ${place}
`
