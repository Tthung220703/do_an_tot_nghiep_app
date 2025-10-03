import React from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, Animated } from 'react-native';

const RoomSelectionModal = ({ 
    showRoomModal, 
    setShowRoomModal, 
    place, 
    selectedRoom, 
    setSelectedRoom, 
    roomModalSlide, 
    styles 
}) => {
    return (
        <Modal
            visible={showRoomModal}
            transparent={true}
            animationType="none"
            onRequestClose={() => setShowRoomModal(false)}
        >
            <View style={styles.modalOverlay}>
                <Animated.View style={[styles.modalContent, { transform: [{ translateY: roomModalSlide }] }]}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Chọn loại phòng</Text>
                        <TouchableOpacity 
                            style={styles.modalCloseButton}
                            onPress={() => setShowRoomModal(false)}
                        >
                            <Text style={styles.modalCloseText}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={place.rooms}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.roomItem,
                                    selectedRoom.roomType === item.roomType && styles.roomItemSelected
                                ]}
                                onPress={() => {
                                    setSelectedRoom(item);
                                    setShowRoomModal(false);
                                }}
                            >
                                <View style={styles.roomInfo}>
                                    <Text style={styles.roomTypeText}>{item.roomType}</Text>
                                    <Text style={styles.roomPriceText}>{item.price.toLocaleString()} VND</Text>
                                    <Text style={styles.roomAvailableText}>Còn {item.available} phòng</Text>
                                </View>
                                {selectedRoom.roomType === item.roomType && (
                                    <Text style={styles.checkmark}>✓</Text>
                                )}
                            </TouchableOpacity>
                        )}
                    />
                </Animated.View>
            </View>
        </Modal>
    );
};

export default RoomSelectionModal;
