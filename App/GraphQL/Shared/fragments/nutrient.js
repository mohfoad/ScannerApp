import gql from 'graphql-tag'

export default gql`
  fragment Nutrient on Nutrient {
    key
    name
    text
    description
    defaultDvp
    defaultDvpDisplay
    perServing
    perServingDisplay
    uom
  }
`
