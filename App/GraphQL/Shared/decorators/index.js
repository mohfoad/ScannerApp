import { graphql } from 'react-apollo'

import {
  productCreate,
  productUpdate,
  productTouch
} from '../mutations'

export const withProductCreate = graphql(productCreate, {
  alias: 'withProductCreate',
  name: 'productCreate',
  refetchQueries: ['Product']
})

export const withProductUpdate = graphql(productUpdate, {
  alias: 'withProductUpdate',
  name: 'productUpdate',
  refetchQueries: ['Product']
})

export const withProductTouch = graphql(productTouch, {
  alias: 'withProductTouch',
  name: 'productTouch',
  refetchQueries: ['Product']
})
