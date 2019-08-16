import { Dimensions, Platform } from 'react-native'

const { width, height } = Dimensions.get('window')

const baseMargin = 10
const basePadding = 10
const baseBorderRadius = 5
const halfBaseBorderRadius = baseBorderRadius / 2
const doubleBaseBorderRadius = baseBorderRadius * 2
const buttonHeight = 54
const inputHeight = 40
const baseSection = 25
const statusBarHeight = 20
const screenWidth = width < height ? width : height
const screenHeight = width < height ? height : width
const formWidth = screenWidth - baseMargin * 3
const inputWidth = formWidth - baseMargin * 4
const modalWidth = screenWidth
const modalHeight = 380
const buttonWidth = inputWidth
const photoWidth = screenWidth * 0.8
const photoHeight = screenWidth * 0.8
const navBarHeight = Platform.OS === 'ios' ? 64 : 54
const breadcrumbHeight = navBarHeight + statusBarHeight

const metrics = {
  buttonHeight,
  baseBorderRadius,
  halfBaseBorderRadius,
  doubleBaseBorderRadius,
  baseMargin,
  basePadding,
  formWidth,
  inputWidth,
  inputHeight,
  modalWidth,
  modalHeight,
  baseSection,
  screenWidth,
  screenHeight,
  buttonWidth,
  photoWidth,
  photoHeight,
  statusBarHeight,
  barcodeWidth: inputWidth,
  barcodeHeight: inputHeight * 3,
  halfBasePadding: basePadding / 2,
  halfBaseMargin: baseMargin / 2,
  halfSection: baseSection / 2,
  doubleBaseMargin: baseMargin * 2,
  doubleBasePadding: basePadding * 2,
  tripleBasePadding: basePadding * 3,
  tripleBaseMargin: baseMargin * 3,
  doubleBaseSection: baseSection * 2,
  horizontalLineHeight: 1,
  searchBarHeight: 30,
  navBarHeight,
  breadcrumbHeight,
  icons: {
    tiny: 15,
    small: 20,
    medium: 30,
    large: 45,
    xl: 50
  },
  images: {
    tiny: 12,
    small: 20,
    medium: 40,
    large: 60,
    xlarge: 100,
    logo: 150
  }
}

export default metrics
