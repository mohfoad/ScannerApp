import gql from 'graphql-tag'
import { product } from '../fragments'

export default gql`
  mutation photoEntryTouchProduct (
    $_id: ID!
  ) {
    photoEntryTouchProduct (_id: $_id) {
      ... Product
    }
  }
  ${product.data}
`
