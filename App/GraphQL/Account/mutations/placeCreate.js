import gql from 'graphql-tag'
import place from '../fragments/session'

export default gql`
  mutation PlaceCreate(
    $data: JSON!
  ) {
    placeCreate(
      data: $data
    ) {
      ...Place
    }
  }
  ${place}
`
