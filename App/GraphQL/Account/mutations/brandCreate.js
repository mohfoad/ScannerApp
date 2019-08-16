import gql from 'graphql-tag'
import brand from '../fragments/brand'

export default gql`
  mutation BrandCreate(
    $data: JSON!
  ) {
    brandCreate(
      data: $data
    ) {
      ...Brand
    }
  }
  ${brand}
`
