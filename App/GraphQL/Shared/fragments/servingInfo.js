import gql from 'graphql-tag'

export default gql`
  fragment ServingInfo on ServingInfo {
    servingSize,
    servingSizeUom,

    servingsPerContainer,
    servingsPerContainerDisplay,

    secondaryServingSize,
    secondaryServingSizeUom,

    totalSize,
    totalSizeUom,

    secondaryTotalSize,
    secondaryTotalSizeUom
  }
`
