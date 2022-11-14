import React, { useRef, useState, useEffect } from "react";
import { Animated, View, StyleSheet, PanResponder, Text, Dimensions, StatusBar, Platform } from "react-native";


const ITGImageSwiper = (props: any) => {
  const width = Dimensions.get("window").width;
  const pan = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
      },
      onPanResponderMove: (e, gestureState) =>  {
        if ( gestureState.x0 > gestureState.moveX ) {
          pan.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        if ( width / 5 <= -gestureState.dx) {
          Animated.timing(pan, {
            toValue: -width,
            duration: 250,
            useNativeDriver: true
          }).start(() => {
            props.onClose && props.onClose();
          });
        } else {
          Animated.timing(pan, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true
          }).start();
        }   
      }
    })
  ).current;
  

  return (
        <Animated.View {...panResponder.panHandlers} style={[ styles.wrapper, {transform: [
          {translateX: pan}
        ]} ]}>
            {props.children}
        </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
  }
});

export default ITGImageSwiper;