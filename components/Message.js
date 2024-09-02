import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideMessage } from '../context/features/message/messageSlice';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import styles from '../styles/MessageStyles';

const Message = () => {
  const dispatch = useDispatch();
  const { state, options } = useSelector((state) => state.message);

  const slideAnim = new Animated.Value(100); // Starts from the bottom of the screen

  useEffect(() => {
    if (state) {
      // Animation for sliding in
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    }

    if (state && options.autoHideDuration) {
      const timer = setTimeout(() => {
        dispatch(hideMessage());
      }, options.autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [state, options.autoHideDuration, dispatch, slideAnim]);

  if (!state) return null;

  // Determine background color based on variant
  const backgroundColor =
    options.variant === 'success' ? '#4CAF50' : 
    options.variant === 'error' ? '#F44336' : 
    options.variant === 'info' ? '#2196F3' : // Blue color for info
    '#333'; // Default color

  return (
    <Animated.View style={[
      styles.messageContainer, 
      { backgroundColor, transform: [{ translateY: slideAnim }] }
    ]}>
      <Text style={styles.messageText}>{options.message}</Text>
    </Animated.View>
  );
};

export default Message;

  


