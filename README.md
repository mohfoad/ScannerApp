#  Sage Scanner App
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)

## :information_source: General

Standard JS compliant React Native App generated via [Ignite](https://github.com/infinitered/ignite).

At its core, the app scans barcodes and interacts with the Sage backend to capture image and product data of in-store products by back-of-house associates.  The app is intended to run on both iOS and Android with re-use of components across both platforms.  Eventually it is hopeful that some of these components make it into the Sage consumer-facing app as well.

In terms of core dependencies, the app uses [Jest](https://facebook.github.io/jest/docs/en/api.html) as the test runner, with [Redux](http://redux.js.org/) & [Redux Sagas](https://redux-saga.js.org/) for state and control flow management, [React Apollo](http://dev.apollodata.com/react/) for declarative data dependencies in components, [Ramda](http://ramdajs.com/docs/) for utility functions, [React Navigation](https://reactnavigation.org/docs/intro/) for routing, [reduxsauce](https://github.com/skellock/reduxsauce) for Redux boilerplate generation, & [apisauce](https://github.com/skellock/apisauce) as a low-fat wrapper around [Axios](https://github.com/mzabriskie/axios) for raw XHR requests.

The project uses `.nvmrc` for node version management.  
As of this writing the we use node `7.1.10`


## :arrow_down: Global dependencies

```sh
brew install node watchman
yarn global add react-native-cli
brew update && brew cask install react-native-debugger && brew cask install reactotron
sudo gem install cocoapods
```
&mdash; [alternatively, if you don't want to use `sudo` to install cocoapods, try this guide instead.](https://guides.cocoapods.org/using/getting-started.html#sudo-less-installation)

The app makes a few core changes to Ignite's boilerplate

- Jest instead of Ava
- React Native Debugger standalone app instead of Chrome developer tools
- yarn instead of npm

## :information_source: Setup

**Step 1:** git clone this repo: `git clone https://github.com/sageapp/scanner-app.git sage-scanner-app`

**Step 2:** cd to the cloned repo: `cd sage-scanner-app`

**Step 3:** Install the node dependencies of the project: `yarn install`

**Step 4:** Get android set up via:

```sh
brew install ant
brew install maven
brew install gradle
```

- Install [Android Studio](https://developer.android.com/studio/install.html) and follow this guide (roughly, as Facebook documentation may not be 1 to 1): [Android setup via Facebook docs]()

- In your shell setup file of choice (e.g. `~/.zshrc` or `~/.bashrc`) add these exports to enable `react-native run-android`, which will require keeping an emulator running before execution, unlike the iOS variant, which spins up the simulator automatically:

```sh
export ANDROID_HOME=~/Library/Android/sdk
export PATH=$ANDROID_HOME/tools:$PATH
export PATH=$ANDROID_HOME/platform-tools:$PATH
```

- Open the **Android Studio** app, hit the ⚙️ and install some SDKs (API 24/25+ as of this writing).  These will install everything is installed into ~/Library/Android/sdk -- with tools like emulator in the tools directory)
- Open the project's `./android` directory in Android Studio, disregard the gradle warnings, and open the emulator manager (AVD) to crete some emulators.  The AVD manager is located in the Android Studio toolbar here: <img width="852" alt="avd-manager-location" src="https://cloud.githubusercontent.com/assets/245741/26455563/9f050026-4138-11e7-9dbf-5467090b3aec.png">
- Install/make some emulator virtual machines (Google Pixel @ API 25 is a good starting point)

```sh
brew cask install android-platform-tools
```


## :arrow_forward: Running

1. cd to the repo
2. Run builds

In separate terminals:

1. `yarn start`
2. `yarn app:run:ios` or `yarn app:run:android` or `yarn app:run:both` depending on which version of the app you want to run.

**To Run on Different iOS Simulators**

You can specify the device the simulator should run with the `--simulator` flag, followed by the device name as a string. The default is `"iPhone 6s"`. If you wish to run your app on an iPhone 7 for example just run:

In separate terminals:

1. `yarn start`
2. `react-native run-ios --simulator "iPhone 7"`

The device names correspond to the list of devices available in Xcode. You can check your available devices by running `xcrun simctl list devices` from the console.


**To Run on Different Android Simulators**

You can check which Android Virtual Devices (AVDs) you have available and run the simulators as follows:

1. To check which AVDs you have available, run `android list avd` and note the `name` key's value
2. Due to some strange path issue, at least on Mac OSX Sierra as of this writing, you have to run the specific Android emulator from the binary in the tools directory directly, so `cd ~/Library/Android/sdk/tools` and from here on out use the local emulator binary via `./emulator`. You can now run the device using `./emulator -avd {{EMULATOR_NAME}}` with the name derived from step 1.
3. In a seperate terminal run `$(~/Library/Android/sdk/tools/emulator -avd {{EMULATOR_NAME}} > /dev/null 2>&1)` with the name derived from step 1.

Now, to run the actual app:

1. `yarn start`
2. Follow the above instructions and boot an Android simulator
3. `react-native run-android`


## :no_entry_sign: Standard Compliant

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

This project adheres to Standard.

**To Lint on Commit**

This is implemented using [ghooks](https://github.com/gtramontina/ghooks). There is no additional setup needed.

**Bypass Lint**

If you have to bypass lint for a special commit that you will come back and clean (pushing something to a branch etc.) then you can bypass git hooks with adding `--no-verify` to your commit command.

**Understanding Linting Errors**

The linting rules are from JS Standard and React-Standard.  [Regular JS errors can be found with descriptions here](http://eslint.org/docs/rules/), while [React errors and descriptions can be found here](https://github.com/yannickcr/eslint-plugin-react).

## :closed_lock_with_key: Secrets

This project uses [react-native-config](https://github.com/luggit/react-native-config) to expose config variables to your javascript code in React Native. You can store API keys
and other sensitive information in a `.env` file.  The following secrets are necessary to run the app:

```
API_BASE_URL=http://api.sageproject.com
OAUTH_USER_ID=YOUROAUTHUSERID
OAUTH_CLIENT_ID=YOUROAUTHCLIENTID
OAUTH_CLIENT_SECRET=YOUROAUTHCLIENTSECRET
```

and access them from React Native like so:

```
import Secrets from 'react-native-config'

Secrets.API_BASE_URL  // 'http://api.sageproject.com'
Secrets.OAUTH_CLIENT_ID  // 'YOUROAUTHCLIENTID'
```

The `.env` file is ignored by git keeping those secrets out of your repo.
