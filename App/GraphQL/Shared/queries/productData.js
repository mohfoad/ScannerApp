
import gql from 'graphql-tag'
import { product } from '../fragments'

export default gql`
  query fetchProductByUpc ($query: JSON!) {
    productQuery (query: $query) {
      ... Product
    }
  }
  ${product.data}
`
