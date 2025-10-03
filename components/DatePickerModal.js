import React from 'react';
import { View, Text, TouchableOpacity, Modal, Animated } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DatePickerModal = ({ 
    visible, 
    onClose, 
    date, 
    onDateChange, 
    title, 
    scaleAnim, 
    styles 
}) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={onClose}
        >
            <View style={styles.dateModalOverlay}>
                <Animated.View style={[styles.dateModalContent, { transform: [{ scale: scaleAnim }] }]}>
                    <View style={styles.dateModalHeader}>
                        <Text style={styles.dateModalTitle}>{title}</Text>
                        <TouchableOpacity 
                            style={styles.dateModalCloseButton}
                            onPress={onClose}
                        >
                            <Text style={styles.dateModalCloseText}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="calendar"
                        onChange={(event, selectedDate) => {
                            if (selectedDate) {
                                onDateChange(selectedDate);
                                onClose();
                            }
                        }}
                    />
                </Animated.View>
            </View>
        </Modal>
    );
};

export default DatePickerModal;
