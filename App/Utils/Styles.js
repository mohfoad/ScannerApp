import _ from 'lodash'

export const makeVariations = (base, ...variations) =>
  _.mapValues(_.fromPairs([base, ...variations]), (diff) => ({ ...base[1], ...diff }))
