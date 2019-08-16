import gql from 'graphql-tag'

export default gql`
  fragment DataEntryTaskFragment on DataEntryTask {
    _id
    productID
    assignedID

    role
    task
    status
    priority
    errorList {
      status
      nextStatus
      error
      createdDate
    }
    history {
      role
      task
      status
      priority
      assignedID
      payload
      createdDate
    }
    payload
    createdDate
    updatedDate
  }
`
