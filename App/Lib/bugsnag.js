import { Client } from 'bugsnag-react-native'

const makeDummyClient = ({ log = false }) => ({
  notify: (error, cb = () => {}) => {
    if (log) console.error('[BUGSNAG:dev]', error)
    cb({ dev: true })
  }
})

const client = __DEV__ ? makeDummyClient({ log: true }) : new Client('092d8cb3eb483344ed6d33d32f8e4d48')

export default client

export const notifyAndLogError = (error) => {
  client.notify(error)
  console.error(error)
}
