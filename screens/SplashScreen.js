/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { AppOpenAd, TestIds, AdEventType } from 'react-native-google-mobile-ads';

const SplashScreen = () => {
  const [animationCount, setAnimationCount] = useState(0);
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useEffect(() => {
    // Rotate animation
    Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 360,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Animation count update
    const animationInterval = setInterval(() => {
      setAnimationCount(count => count + 1);
    }, 1000);

    // Load and show app open ad before navigating
    const appOpenAd = AppOpenAd.createForAdRequest(TestIds.APP_OPEN);

    appOpenAd.load();

    appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
      appOpenAd.show();
    });

    appOpenAd.addAdEventListener(AdEventType.CLOSED, () => {
      navigation.navigate('Home'); // Ensure 'Home' is the correct route name
    });

    appOpenAd.addAdEventListener(AdEventType.ERROR, (error) => {
      console.log('Ad failed to load:', error);
      navigation.navigate('Home');
    });

    // Clean up on unmount
    return () => {
      clearInterval(animationInterval);
    };
  }, [navigation, rotationAnim]);

  // Interpolating rotation value
  const rotation = rotationAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <View style={styles.borderTopLeft} />
        <View style={styles.borderTopRight} />
        <View style={styles.borderBottomLeft} />
        <View style={styles.borderBottomRight} />
        <View style={styles.iconContainer}>
          <Icon name="wifi" size={50} color="black" />
        </View>
      </View>
      <Text style={styles.title}>Wi-Fi Share</Text>
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>L</Text>
        <Animated.View style={[styles.loadingIndicator, { transform: [{ rotate: rotation }] }]}>
          <Svg height="18" width="18">
            <Circle
              cx="9"
              cy="9"
              r="9"
              stroke="black"
              strokeWidth="5"
              strokeDasharray="50, 100"
              strokeDashoffset={rotationAnim.interpolate({
                inputRange: [0, 100],
                outputRange: [0, 50],
              })}
              fill="none"
            />
          </Svg>
        </Animated.View>
        <Text style={styles.loadingText}>ADING</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  iconWrapper: {
    position: 'relative',
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  borderTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: 'black',
  },
  borderTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: 'black',
  },
  borderBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 20,
    height: 20,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: 'black',
  },
  borderBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: 'black',
  },
  iconContainer: {
    position: 'absolute',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    paddingTop: 30,
    color: 'black',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
  },
  loadingIndicator: {
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 9,
  },
});

export default SplashScreen;
