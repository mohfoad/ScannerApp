import { Dimensions } from 'react-native';

export const deviceHeight = Dimensions.get('window').height;
export const deviceWidth = Dimensions.get('window').width;
export const heightRatio = Dimensions.get('window').height / 667;
export const widthRatio = Dimensions.get('window').width / 375;
