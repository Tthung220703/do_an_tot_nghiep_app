import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export const useOrderAnimations = (showRoomModal, showCheckInPicker, showCheckOutPicker) => {
    const roomModalSlide = useRef(new Animated.Value(300)).current;
    const checkInModalScale = useRef(new Animated.Value(0)).current;
    const checkOutModalScale = useRef(new Animated.Value(0)).current;

    // Room modal animation
    useEffect(() => {
        if (showRoomModal) {
            Animated.spring(roomModalSlide, {
                toValue: 0,
                useNativeDriver: true,
                tension: 100,
                friction: 8,
            }).start();
        } else {
            Animated.timing(roomModalSlide, {
                toValue: 300,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [showRoomModal]);

    // Check-in modal animation
    useEffect(() => {
        if (showCheckInPicker) {
            Animated.spring(checkInModalScale, {
                toValue: 1,
                useNativeDriver: true,
                tension: 100,
                friction: 8,
            }).start();
        } else {
            Animated.timing(checkInModalScale, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [showCheckInPicker]);

    // Check-out modal animation
    useEffect(() => {
        if (showCheckOutPicker) {
            Animated.spring(checkOutModalScale, {
                toValue: 1,
                useNativeDriver: true,
                tension: 100,
                friction: 8,
            }).start();
        } else {
            Animated.timing(checkOutModalScale, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [showCheckOutPicker]);

    return {
        roomModalSlide,
        checkInModalScale,
        checkOutModalScale,
    };
};
