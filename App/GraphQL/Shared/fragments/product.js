import gql from 'graphql-tag'

const makeFragment = (name, type) => gql`
  fragment ${name} on ${type} {
    _id
    name
    slug
    price

    brandID
    createdByID

    image {
      _id
      thumbnail
      source
    }

    mediaListIDs

    brand {
      _id
      name
    }

    mediaList {
      _id
      source
      thumbnail
    }

    topology

    isPublished
    isReadyForReview
    upc
    lastTouchedDate
  }
`

const data = makeFragment('Product', 'Product')

export {
  data
}
