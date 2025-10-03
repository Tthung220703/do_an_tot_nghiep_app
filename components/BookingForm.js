import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const BookingForm = ({ 
    selectedRoom, 
    setShowRoomModal, 
    checkInDate, 
    checkOutDate, 
    setShowCheckInPicker, 
    setShowCheckOutPicker, 
    formatDateToVietnamese,
    roomCount,
    setRoomCount,
    calculateTotalPrice,
    handleOrder,
    styles 
}) => {
    return (
        <View style={styles.bookingForm}>
            <Text style={styles.formTitle}>Thông tin đặt phòng</Text>
            
            {/* Room Selection */}
            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Loại phòng</Text>
                <TouchableOpacity 
                    style={styles.pickerButton}
                    onPress={() => setShowRoomModal(true)}
                >
                    <View style={styles.pickerButtonContent}>
                        <Text style={styles.pickerButtonText} numberOfLines={2}>
                            {selectedRoom.roomType}
                        </Text>
                        <Text style={styles.pickerPriceText}>
                            {selectedRoom.price.toLocaleString()} VND
                        </Text>
                    </View>
                    <Text style={styles.pickerArrow}>▼</Text>
                </TouchableOpacity>
                <Text style={styles.availableText}>
                    Còn {selectedRoom.available} phòng
                </Text>
            </View>

            {/* Date Selection */}
            <View style={styles.dateRow}>
                <View style={styles.dateGroup}>
                    <Text style={styles.inputLabel}>Check-in</Text>
                    <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => setShowCheckInPicker(true)}
                    >
                        <Text style={styles.dateDayText}>
                            {formatDateToVietnamese(checkInDate).day}
                        </Text>
                        <Text style={styles.dateMonthYearText}>
                            {formatDateToVietnamese(checkInDate).monthYear}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.dateGroup}>
                    <Text style={styles.inputLabel}>Check-out</Text>
                    <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => setShowCheckOutPicker(true)}
                    >
                        <Text style={styles.dateDayText}>
                            {formatDateToVietnamese(checkOutDate).day}
                        </Text>
                        <Text style={styles.dateMonthYearText}>
                            {formatDateToVietnamese(checkOutDate).monthYear}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Room Count */}
            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Số lượng phòng</Text>
                <View style={styles.roomCountContainer}>
                    <TouchableOpacity 
                        style={[styles.roomCountButton, roomCount <= 1 && styles.roomCountButtonDisabled]}
                        onPress={() => setRoomCount(Math.max(1, roomCount - 1))}
                        disabled={roomCount <= 1}
                    >
                        <Text style={[styles.roomCountButtonText, roomCount <= 1 && styles.roomCountButtonTextDisabled]}>−</Text>
                    </TouchableOpacity>
                    
                    <View style={styles.roomCountDisplay}>
                        <Text style={styles.roomCountText}>{roomCount}</Text>
                    </View>
                    
                    <TouchableOpacity 
                        style={[styles.roomCountButton, roomCount >= selectedRoom.available && styles.roomCountButtonDisabled]}
                        onPress={() => setRoomCount(Math.min(selectedRoom.available, roomCount + 1))}
                        disabled={roomCount >= selectedRoom.available}
                    >
                        <Text style={[styles.roomCountButtonText, roomCount >= selectedRoom.available && styles.roomCountButtonTextDisabled]}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Total Price */}
            <View style={styles.totalContainer}>
                <View style={styles.totalInfo}>
                    <Text style={styles.totalLabel}>Tổng cộng</Text>
                    <Text style={styles.totalSubLabel}>
                        {roomCount} phòng × {selectedRoom.price.toLocaleString()} VND
                    </Text>
                </View>
                <View style={styles.totalPriceContainer}>
                    <Text style={styles.totalPrice}>{calculateTotalPrice().toLocaleString()}</Text>
                    <Text style={styles.totalCurrency}>VND</Text>
                </View>
            </View>

            {/* Order Button */}
            <TouchableOpacity style={styles.orderButton} onPress={handleOrder}>
                <Text style={styles.orderButtonText}>Đặt phòng ngay</Text>
            </TouchableOpacity>
        </View>
    );
};

export default BookingForm;
