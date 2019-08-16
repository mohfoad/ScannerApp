import traverse from 'traverse'
import { memoize } from 'lodash'

/*
 * Removes __typename from every object
 *
 * Especially useful when passing the data along to forms or things that iterate upon it
 *  e.g. this allows you to safely do:
 *      for (let nutrient in Product.nutritionMap) { ... }
 *  without having to accidentally iterate over the "__typeman" nutrient
 */
const sanitizeApolloResult = (payload) =>
  traverse(payload).map(function (value) {
    if (this.key !== '__typename') return value
    this.delete()
  })

export default sanitizeApolloResult

export const sanitizeApolloResultMemoized = memoize(sanitizeApolloResult)
