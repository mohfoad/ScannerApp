import gql from 'graphql-tag'
import brand from '../fragments/brand'

export default gql`
  mutation BrandUpdate(
    $_id: ID!,
    $data: JSON!
  ) {
    brandUpdate(
      _id: $_id,
      data: $data
    ) {
      ...Brand
    }
  }
  ${brand}
`
