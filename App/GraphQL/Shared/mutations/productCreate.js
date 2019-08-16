import gql from 'graphql-tag'
import { product } from '../fragments'

export default gql`
  mutation ProductCreate(
    $data: JSON!
  ) {
    productCreate(
      data: $data
    ) {
      ... Product
    }
  }
  ${product.data}
`
