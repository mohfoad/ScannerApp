import {graphql} from 'react-apollo'

import {
    session
} from '../queries'

import {
    activateAccount,
    createAccount,
    login,
    logout,
    issueAccountToken,
    updateAccountWithToken,
    placeCreate,
    brandCreate,
    brandUpdate
} from '../mutations'

export const withAuth = graphql(session, {
    alias: 'withAuth',
    name: 'auth'
});

export const withActivateAccount = graphql(activateAccount, {
    alias: 'withActivateAccount',
    name: 'activateAccount',
    refetchQueries: ['Session']
});

export const withCreateAccount = graphql(createAccount, {
    alias: 'withCreateAccount',
    name: 'createAccount',
    refetchQueries: ['Session']
});

export const withLogin = graphql(login, {
    alias: 'withLogin',
    name: 'login',
    refetchQueries: ['Session']
});

export const withLogout = graphql(logout, {
    alias: 'withLogout',
    name: 'logout',
    refetchQueries: ['Session']
});

export const withIssueAccountToken = graphql(issueAccountToken, {
    alias: 'withIssueAccountToken',
    name: 'issueAccountToken',
    refetchQueries: ['Session']
});

export const withUpdateAccountWithToken = graphql(updateAccountWithToken, {
    alias: 'withUpdateAccountWithToken',
    name: 'updateAccountWithToken',
    refetchQueries: ['Session']
});

export const withPlaceCreate = graphql(placeCreate, {
    alias: 'withPlaceCreate',
    name: 'placeCreate'
});

export const withBrandCreate = graphql(brandCreate, {
    alias: 'withBrandCreate',
    name: 'brandCreate',
    refetchQueries: ['Brand']
});

export const withBrandUpdate = graphql(brandUpdate, {
    alias: 'withBrandUpdate',
    name: 'brandUpdate',
    refetchQueries: ['Brand']
});
