import gql from 'graphql-tag'
import { product } from '../fragments'

export default gql`
  mutation productUpdate (
    $_id: ID!,
    $data: JSON!
  ) {
    productUpdate (_id: $_id, data: $data) {
      ... Product
    }
  }
  ${product.data}
`
