/**
 * Stripped down version of withApollo.js from web-2
 */

import _ from 'lodash'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag'
import {withPropsOnChange, compose, lifecycle} from 'recompose'

const queryCache = {};
// if (typeof window !== 'undefined') window.__queryCache = queryCache;

export default (...args) => getWithApolloComponents(...args).decorator

export const getWithApolloComponents = (def, params, select, fragments, opts) => {
    const {
        fetchMore,
        simpleMutation,
        renderLoading,
        cleanResult,
        customRefetchQueries,
        ...options
    } = _.defaults({}, opts, {
        // Makes the mutation take the variables as the first argument,
        //  and the broader options as the 2nd one.
        // Also resolves to the result instead of the wrapper
        simpleMutation: true,

        // Whether to add a default fetchMore handler to the query
        // Made to work with standard *Query endpoints
        // Expects at least {limit, skip} variables for the query
        fetchMore: false,

        // Only relevant for queries
        // Pass a function to render the initial load
        // Available standard loading functions (string keys) - see defaultLoading
        renderLoading: null,

        // Custom flavor of refetchQueries: [String], that actually works, unlike the stupid apollo one
        customRefetchQueries: []
    });

    const match = def.match(/^(mutation|query)\s+(?:(\w+)\:)?(\w+)$/);

    if (!match) {
        throw new Error([
            `[withApollo] Invalid definition "${def}".\n`,
            '    Must be "(mutation|query) (alias:)?name".\n',
            '    Example "query result:search" or "mutation userUpdate"'
        ].join(''))
    }

    let [, type, resultName = 'result', name] = match;

    if (!['query', 'mutation'].includes(type)) {
        throw new Error(`[withApollo] Invalid type: "${type}"`)
    }

    options.name = options.name || name;

    if (type === 'query') _.defaults(options, {notifyOnNetworkStatusChange: true});

    const wrap = ([l, r], str) => !str ? '' : `${l}${str}${r}`;

    const defParams = wrap('()', _.map(params, (val, key) => `$${key}: ${val}`).join(', '));
    const opParams = wrap('()', _.map(params, (v, key) => `${key}: $${key}`).join(', '));

    if (!Array.isArray(fragments)) fragments = _.filter([fragments]);

    const query = gql`
        ${type} ${name} ${defParams} {
            ${resultName}:${name} ${opParams}
                ${wrap('{}', select)}
        }

        ${fragments[0] || ''}
        ${fragments[1] || ''}
        ${fragments[2] || ''}
        ${fragments[3] || ''}
    `;

    const _extend = type === 'query' ? _extendProps.bind(null, options, name) : _.noop;

    _extend(props => ({gql: query}));

    if (fetchMore) _extend(props => _attachFetchMore(resultName, props));

    let decorator = graphql(query, options);

    if (type === 'mutation' && simpleMutation) {
        decorator = compose(decorator, withSimpleMutation(options.name, resultName))
    }

    if (type === 'mutation' && !_.isEmpty(customRefetchQueries)) {
        console.assert(Array.isArray(customRefetchQueries), 'customRefetchQueries needs to be an array');
        decorator = compose(decorator, withCustomRefetchQueries(options.name, customRefetchQueries))
    }

    if (type === 'query' && renderLoading) {
        let fn = renderLoading;
        if (typeof fn === 'string') {
            fn = defaultLoading[fn];
            if (!fn) throw new Error(`No default loading behavior: "${renderLoading}"`)
        } else {
            console.assert(
                typeof renderLoading === 'function',
                'renderLoading must be a function or a string'
            )
        }
        decorator = compose(decorator, withLoading(options.name, resultName, fn))
    }

    if (type === 'query' && cleanResult) {
        decorator = compose(decorator, withCleanResult(options.name, resultName))
    }

    if (type === 'query') {
        decorator = compose(decorator, withQueryCache(options.name))
    }

    return {
        [`with${options.name[0].toUpperCase()}${options.name.slice(1)}`]: decorator,
        decorator,
        query,
        options,
        getRefetch: props => ({
            ...(!options.options ? null : options.options(props)),
            query
        })
    }
};

const _extendProps = (options, name, fn) => {
    const oldProps = options.props;
    const wrapper = props => {
        if (props[name] && typeof props[name] === 'object') {
            props = {...props};
            const result = fn(props[name]);
            if (result) {
                // We manually assign (instead of clone) to preserve getters (like get error)
                for (let key in result) props[name][key] = result[key]
            }
        }

        return props
    };

    options.props = oldProps
        ? (...args) => wrapper(oldProps(...args))
        : wrapper
};

const _attachFetchMore = (resultName, props) => {
    const result = props && props[resultName];
    const limit = props.variables.limit || 20;
    const fetchMoreDone = !!(_.isEmpty(result) || result.length % limit !== 0);

    const old = props.fetchMore;

    return {
        fetchMoreDone,
        fetchMore: fetchMoreDone ? null
            : () =>
                old({
                    variables: {skip: result.length},
                    updateQuery: (previousResult, {fetchMoreResult}) =>
                        !_.size(fetchMoreResult[resultName])
                            ? previousResult
                            : {
                                ...previousResult,
                                [resultName]: [
                                    ...previousResult[resultName],
                                    ...fetchMoreResult[resultName]
                                ]
                            }
                })
    }
};

// apollo refetch is broken and it's a pain to work with, so we're implementing our own refetchQueries: [ String ]
const ID_SYMBOL = Symbol('withApollo:queryCache');
let idCounter = 0;
const withQueryCache = propName =>
    lifecycle({
        componentDidMount() {
            this[ID_SYMBOL] = ++idCounter;
            queryCache[propName] = queryCache[propName] || [];
            queryCache[propName].push({id: this[ID_SYMBOL], query: this.props[propName]})
        },

        componentWillReceiveProps(nextProps) {
            if (nextProps[propName] !== this.props[propName]) {
                const obj = _.find(queryCache[propName], {id: this[ID_SYMBOL]});
                if (obj) obj.query = nextProps[propName]
            }
        },

        // queries are cached even if components are unmounted
        componentWillUnmount() {
            queryCache[propName] = _.filter(queryCache[propName], item => item.instance !== this)
        }
    });

const withCustomRefetchQueries = (propName, customRefetchQueries) =>
    withPropsOnChange([propName], props => {
        if (typeof props[propName] !== 'function') return null;

        const enhance = fn => (...args) =>
            fn(...args).then(result => {
                setTimeout(() => {
                    for (let queryName of customRefetchQueries) {
                        const list = queryCache[queryName];
                        if (_.isEmpty(list)) continue;
                        for (let {query} of list) query.refetch()
                    }
                }, 50);
                return result
            });

        const fn = enhance(props[propName]);
        if (props[propName].original) fn.original = enhance(props[propName].original);

        return {[propName]: fn}
    });

/**
 * Apollo mutations take multiple properties, but the 99% use-case is to just pass variables.
 * This caters to the 99%
 *
 * Converts the mutation function property with the given "name" from:
 *
 *  mutate({ variables: { foo: 1, bar: 2 } })
 *
 * to the simplified API:
 *
 *  mutate({ foo: 1, bar: 2 })
 *
 */
const withSimpleMutation = (propName, resultName) =>
    withPropsOnChange([propName], props => {
        if (typeof props[propName] !== 'function') return null;

        const fn = (variables, extra) =>
            props[propName]({...extra, variables})
                .then(({data, __errors}) => {
                    if (!_.isEmpty(__errors)) return Promise.reject(__errors);
                    return data[resultName]
                });

        fn.original = props[propName];

        return {[propName]: fn}
    });

const _withQueryMapResultOnChange = (propName, resultName, callback) =>
    withPropsOnChange(
        [propName],
        props => ({
            [propName]: {
                ...props[propName],
                [resultName]: callback(_.get(props[propName], [resultName]), props)
            }
        })
    );

const withLoading = (propName, resultName, renderLoading) => Klass => props =>
    _.get(props[propName], 'loading') && !_.get(props[propName], resultName)
        ? renderLoading(props)
        : <Klass {...props} />;

import React from 'react'
import {Image} from 'react-native'

const defaultLoading = {
    default: () =>
        <Image
            source={require('../Themes').Images.loading}
            style={{width: 32, height: 32, alignSelf: 'center'}}
        />
};
