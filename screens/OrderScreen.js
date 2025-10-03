import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Image,
    ScrollView,
    Alert,
    FlatList,
    TouchableOpacity,
    Modal,
    Animated,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const OrderScreen = ({ route, navigation }) => {
    const { place } = route.params;

    const [selectedRoom, setSelectedRoom] = useState(place.rooms[0]);
    const [roomCount, setRoomCount] = useState(1);
    const [checkInDate, setCheckInDate] = useState(new Date());
    const [checkOutDate, setCheckOutDate] = useState(new Date());
    const [showCheckInPicker, setShowCheckInPicker] = useState(false);
    const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);
    const [showRoomModal, setShowRoomModal] = useState(false);
    const [mainImage, setMainImage] = useState(place.mainImage);
    
    // Animation values
    const roomModalSlide = useRef(new Animated.Value(300)).current;
    const checkInModalScale = useRef(new Animated.Value(0)).current;
    const checkOutModalScale = useRef(new Animated.Value(0)).current;

    const formatDateToVietnamese = (date) => {
        const d = new Date(date);
        const day = d.getDate();
        const month = d.toLocaleString('vi-VN', { month: 'short' });
        const year = d.getFullYear();
        return {
            day: day,
            monthYear: `${month} ${year}`
        };
    };

    // Animation effects
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

    const calculateTotalPrice = () => {
        const oneDay = 24 * 60 * 60 * 1000;
        const diffDays = Math.round(
            Math.abs((checkOutDate - checkInDate) / oneDay)
        );
        return selectedRoom.price * roomCount * (diffDays || 1);
    };

    const handleOrder = () => {
        if (roomCount > selectedRoom.available) {
            Alert.alert(
                'Not enough rooms available',
                `Only ${selectedRoom.available} room(s) left for the selected type.`
            );
            return;
        }

        if (checkInDate >= checkOutDate) {
            Alert.alert('Invalid Dates', 'Check-out date must be after check-in date.');
            return;
        }

        const totalPrice = calculateTotalPrice();

        navigation.navigate('Payment', {
            place,
            selectedRoom,
            roomCount,
            checkInDate: checkInDate.toISOString(),
            checkOutDate: checkOutDate.toISOString(),
            totalPrice,
        });
    };

    return (
        <View style={styles.page}>
                   {/* Back Button */}
                   <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                       <Text style={styles.backButtonText}>← Quay lại</Text>
                   </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <View style={styles.card}>
                    {/* Hotel Image */}
                    <Image source={{ uri: mainImage }} style={styles.hotelImage} />
                    
                    {/* Hotel Info */}
                    <View style={styles.hotelInfo}>
                        <Text style={styles.hotelName}>{place.hotelName}</Text>
                        <Text style={styles.hotelType}>Loại hình: {place.type === 'hotel' ? 'Hotel' : 'Homestay'}</Text>
                        <Text style={styles.hotelAddress}>📍 {place.address}</Text>
                        
                        {/* Rating */}
                        <View style={styles.ratingContainer}>
                            <Text style={styles.ratingText}>⭐ {place.rating ? `${place.rating}/5` : 'Chưa có đánh giá'}</Text>
                        </View>
                        
                        {/* Description */}
                        <Text style={styles.description}>{place.description}</Text>
                        
                        {/* Amenities */}
                        <View style={styles.amenitiesContainer}>
                            <Text style={styles.amenitiesTitle}>Tiện ích:</Text>
                            <View style={styles.amenitiesList}>
                                {place.amenities.map((amenity, index) => (
                                    <View key={index} style={styles.amenityTag}>
                                        <Text style={styles.amenityText}>{amenity}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* Sub Images */}
                    <Text style={styles.subImagesTitle}>Hình ảnh khác:</Text>
                    <View style={styles.subImagesWrapper}>
                        <FlatList
                            data={[place.mainImage, ...place.subImages]}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity 
                                    onPress={() => setMainImage(item)}
                                    style={[
                                        styles.subImageContainer,
                                        mainImage === item && styles.subImageContainerSelected
                                    ]}
                                >
                                    <Image source={{ uri: item }} style={styles.subImage} />
                                </TouchableOpacity>
                            )}
                            contentContainerStyle={styles.subImagesContainer}
                        />
                    </View>

                    {/* Booking Form */}
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
                </View>
            </ScrollView>

            {/* Room Selection Modal */}
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

            {/* Date Pickers Modal */}
            <Modal
                visible={showCheckInPicker}
                transparent={true}
                animationType="none"
                onRequestClose={() => setShowCheckInPicker(false)}
            >
                <View style={styles.dateModalOverlay}>
                    <Animated.View style={[styles.dateModalContent, { transform: [{ scale: checkInModalScale }] }]}>
                        <View style={styles.dateModalHeader}>
                            <Text style={styles.dateModalTitle}>Chọn ngày Check-in</Text>
                            <TouchableOpacity 
                                style={styles.dateModalCloseButton}
                                onPress={() => setShowCheckInPicker(false)}
                            >
                                <Text style={styles.dateModalCloseText}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        <DateTimePicker
                            value={checkInDate}
                            mode="date"
                            display="calendar"
                            onChange={(event, selectedDate) => {
                                if (selectedDate) {
                                    setCheckInDate(selectedDate);
                                    setShowCheckInPicker(false);
                                }
                            }}
                        />
                    </Animated.View>
                </View>
            </Modal>

            <Modal
                visible={showCheckOutPicker}
                transparent={true}
                animationType="none"
                onRequestClose={() => setShowCheckOutPicker(false)}
            >
                <View style={styles.dateModalOverlay}>
                    <Animated.View style={[styles.dateModalContent, { transform: [{ scale: checkOutModalScale }] }]}>
                        <View style={styles.dateModalHeader}>
                            <Text style={styles.dateModalTitle}>Chọn ngày Check-out</Text>
                            <TouchableOpacity 
                                style={styles.dateModalCloseButton}
                                onPress={() => setShowCheckOutPicker(false)}
                            >
                                <Text style={styles.dateModalCloseText}>✕</Text>
                            </TouchableOpacity>
                        </View>
                    <DateTimePicker
                        value={checkOutDate}
                        mode="date"
                            display="calendar"
                        onChange={(event, selectedDate) => {
                                if (selectedDate) {
                                    setCheckOutDate(selectedDate);
                            setShowCheckOutPicker(false);
                                }
                            }}
                        />
                    </Animated.View>
            </View>
            </Modal>
            </View>
    );
};

const styles = StyleSheet.create({
    page: { flex: 1, backgroundColor: '#f6f7fb' },
    container: { flexGrow: 1, padding: 20 },
    // Back button styles
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        paddingTop: 50,
        backgroundColor: '#f6f7fb',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    backButtonText: {
        fontSize: 16,
        color: '#c026d3',
        fontWeight: '600',
        marginLeft: 4,
    },
    card: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 24,
        padding: 24,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 8 },
    },
    hotelImage: {
        width: '100%',
        height: 200,
        borderRadius: 16,
        marginBottom: 20,
    },
    hotelInfo: {
        marginBottom: 20,
    },
    hotelName: {
        fontSize: 28,
        fontWeight: '900',
        color: '#0f172a',
        marginBottom: 8,
    },
    hotelType: {
        fontSize: 16,
        color: '#64748b',
        marginBottom: 4,
    },
    hotelAddress: {
        fontSize: 16,
        color: '#64748b',
        marginBottom: 12,
    },
    ratingContainer: {
        marginBottom: 16,
    },
    ratingText: {
        fontSize: 16,
        color: '#f59e0b',
        fontWeight: '600',
    },
    description: {
        fontSize: 15,
        color: '#64748b',
        lineHeight: 22,
        marginBottom: 16,
    },
    amenitiesContainer: {
        marginBottom: 20,
    },
    amenitiesTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 8,
    },
    amenitiesList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    amenityTag: {
        backgroundColor: '#f0f9ff',
        borderWidth: 1,
        borderColor: '#0ea5e9',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    amenityText: {
        fontSize: 14,
        color: '#0ea5e9',
        fontWeight: '600',
    },
    subImagesTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 12,
    },
    subImagesWrapper: {
        marginBottom: 24,
    },
    subImagesContainer: {
        paddingRight: 20,
    },
    subImageContainer: {
        marginRight: 12,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'transparent',
        overflow: 'hidden',
    },
    subImageContainerSelected: {
        borderColor: '#c026d3',
        borderWidth: 3,
    },
    subImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    bookingForm: {
        backgroundColor: '#f8fafc',
        borderRadius: 16,
        padding: 20,
        marginTop: 8,
    },
    formTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    pickerButton: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        padding: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 60,
    },
    pickerButtonContent: {
        flex: 1,
        marginRight: 8,
    },
    pickerButtonText: {
        fontSize: 16,
        color: '#0f172a',
        fontWeight: '600',
        marginBottom: 4,
    },
    pickerPriceText: {
        fontSize: 14,
        color: '#c026d3',
        fontWeight: '600',
    },
    pickerArrow: {
        fontSize: 12,
        color: '#9ca3af',
    },
    availableText: {
        fontSize: 14,
        color: '#10b981',
        marginTop: 4,
        fontWeight: '500',
    },
    dateRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    dateGroup: {
        flex: 1,
    },
    dateButton: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 14,
        alignItems: 'center',
        minHeight: 60,
        justifyContent: 'center',
    },
    dateDayText: {
        fontSize: 20,
        color: '#0f172a',
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 2,
    },
    dateMonthYearText: {
        fontSize: 12,
        color: '#6b7280',
        textAlign: 'center',
        fontWeight: '500',
    },
    roomCountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 16,
        paddingVertical: 8,
        paddingHorizontal: 16,
        maxWidth: 200,
        alignSelf: 'center',
    },
    roomCountButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#c026d3',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#c026d3',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    roomCountButtonDisabled: {
        backgroundColor: '#f1f5f9',
        shadowOpacity: 0,
        elevation: 0,
    },
    roomCountButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
    roomCountButtonTextDisabled: {
        color: '#cbd5e1',
    },
    roomCountDisplay: {
        minWidth: 40,
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    roomCountText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1e293b',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    totalInfo: {
        flex: 1,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: 4,
    },
    totalSubLabel: {
        fontSize: 12,
        color: '#6b7280',
    },
    totalPriceContainer: {
        alignItems: 'flex-end',
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: '700',
        color: '#c026d3',
        lineHeight: 22,
    },
    totalCurrency: {
        fontSize: 12,
        color: '#6b7280',
        fontWeight: '500',
    },
    orderButton: {
        backgroundColor: '#c026d3',
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
    },
    orderButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '700',
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
        opacity: 1,
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a',
    },
    modalCloseButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCloseText: {
        fontSize: 16,
        color: '#6b7280',
    },
    roomItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    roomItemSelected: {
        backgroundColor: '#f8fafc',
    },
    roomInfo: {
        flex: 1,
    },
    roomTypeText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: 4,
    },
    roomPriceText: {
        fontSize: 14,
        color: '#c026d3',
        fontWeight: '600',
        marginBottom: 2,
    },
    roomAvailableText: {
        fontSize: 12,
        color: '#10b981',
    },
    checkmark: {
        fontSize: 16,
        color: '#c026d3',
        fontWeight: 'bold',
    },
    // Date Modal styles
    dateModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 1,
    },
    dateModalContent: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        margin: 20,
        maxWidth: 400,
        width: '90%',
    },
    dateModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    dateModalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a',
    },
    dateModalCloseButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateModalCloseText: {
        fontSize: 16,
        color: '#6b7280',
    },
});

export default OrderScreen;
