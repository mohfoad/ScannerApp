import React from 'react';
import { TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Images } from '../../Themes';
import styles from './styles';

export const CustomHeader = ({ title, onClose }) => {
  return (
      <Animatable.View style={styles.title}>
          <Animatable.Text style={styles.titleText}>{title}</Animatable.Text>
          <TouchableOpacity style={styles.closeImageWrapper} onPress={() => onClose()}>
              <Animatable.Image source={Images.closeBlack} style={styles.close} />
          </TouchableOpacity>
      </Animatable.View>
  )
};
