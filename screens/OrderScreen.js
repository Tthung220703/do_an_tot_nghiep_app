import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Image,
    Button,
    ScrollView,
    Alert,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const OrderScreen = ({ route, navigation }) => {
    const { place } = route.params;

    const [selectedRoom, setSelectedRoom] = useState(place.rooms[0]);
    const [roomCount, setRoomCount] = useState(1);
    const [checkInDate, setCheckInDate] = useState(new Date());
    const [checkOutDate, setCheckOutDate] = useState(new Date());
    const [showCheckInPicker, setShowCheckInPicker] = useState(false);
    const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);

    const formatDateToVietnamese = (date) => {
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        return new Intl.DateTimeFormat('vi-VN', options).format(new Date(date));
    };

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
        <ScrollView style={styles.container}>
            {/* Header Image */}
            <Image source={{ uri: place.mainImage }} style={styles.image} />
            <Text style={styles.name}>{place.hotelName}</Text>
            <Text style={styles.type}>Loại hình: {place.type === 'hotel' ? 'Hotel' : 'Homestay'}</Text>
            <Text style={styles.address}>Địa chỉ: {place.address}</Text>

            {/* Description */}
            <View style={styles.descriptionBox}>
                <Text style={styles.descriptionText}>{place.description}</Text>
            </View>

            {/* Rating & Amenities */}
            <View style={styles.infoRow}>
                <Text style={styles.rating}>
                    <Text style={styles.bold}>Đánh giá: </Text>
                    {place.rating ? `${place.rating} / 5` : 'No ratings yet'}
                </Text>
                <Text style={styles.amenities}>
                    <Text style={styles.bold}>Tiện ích: </Text>
                    {place.amenities.join(', ')}
                </Text>
            </View>

            {/* Sub Images */}
            <Text style={styles.subHeading}>Các hình ảnh khác:</Text>
            <FlatList
                data={place.subImages}
                horizontal
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Image source={{ uri: item }} style={styles.subImage} />
                )}
                contentContainerStyle={styles.subImagesContainer}
            />

            {/* Date Pickers */}
            <View style={styles.datePickerContainer}>
                <Text style={styles.inputLabel}>Ngày Check-In:</Text>
                <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowCheckInPicker(true)}
                >
                    <Text style={styles.dateButtonText}>
                        {formatDateToVietnamese(checkInDate)}
                    </Text>
                </TouchableOpacity>
                {showCheckInPicker && (
                    <DateTimePicker
                        value={checkInDate}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowCheckInPicker(false);
                            if (selectedDate) setCheckInDate(selectedDate);
                        }}
                    />
                )}
            </View>

            <View style={styles.datePickerContainer}>
                <Text style={styles.inputLabel}>Ngày Check-Out:</Text>
                <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowCheckOutPicker(true)}
                >
                    <Text style={styles.dateButtonText}>
                        {formatDateToVietnamese(checkOutDate)}
                    </Text>
                </TouchableOpacity>
                {showCheckOutPicker && (
                    <DateTimePicker
                        value={checkOutDate}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowCheckOutPicker(false);
                            if (selectedDate) setCheckOutDate(selectedDate);
                        }}
                    />
                )}
            </View>

            {/* Room Picker */}
            <View style={styles.dropdownContainer}>
                <Text style={styles.inputLabel}>Loại phòng:</Text>
                <Picker
                    selectedValue={selectedRoom}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSelectedRoom(itemValue)}
                >
                    {place.rooms.map((room, index) => (
                        <Picker.Item
                            key={index}
                            label={`${room.roomType} - ${room.price.toLocaleString()} VND`}
                            value={room}
                        />
                    ))}
                </Picker>
                {selectedRoom && (
                    <Text style={styles.availableRooms}>
                        Số phòng trống: {selectedRoom.available}
                    </Text>
                )}
            </View>

            {/* Order Section */}
            <View style={styles.orderSection}>
                <Text style={styles.inputLabel}>Số lượng phòng:</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={roomCount.toString()}
                    onChangeText={(text) => setRoomCount(Number(text))}
                />
                <TouchableOpacity style={styles.orderButton} onPress={handleOrder}>
                    <Text style={styles.orderButtonText}>Xác nhận đặt phòng</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 15,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    type: {
        fontSize: 18,
        color: '#555',
        marginBottom: 5,
    },
    address: {
        fontSize: 16,
        color: '#555',
        marginBottom: 10,
    },
    descriptionBox: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        elevation: 2,
    },
    descriptionText: {
        fontSize: 16,
        color: '#666',
    },
    infoRow: {
        marginBottom: 20,
    },
    bold: {
        fontWeight: 'bold',
    },
    rating: {
        fontSize: 16,
        color: '#f39c12',
        marginBottom: 5,
    },
    amenities: {
        fontSize: 16,
        color: '#007AFF',
        marginBottom: 5,
    },
    subHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 10,
    },
    subImagesContainer: {
        marginBottom: 20,
    },
    datePickerContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
    },
    dateButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    dateButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    dropdownContainer: {
        marginBottom: 20,
    },
    picker: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginBottom: 10,
    },
    availableRooms: {
        fontSize: 16,
        color: '#007AFF',
    },
    orderSection: {
        marginTop: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        fontSize: 16,
        marginBottom: 10,
    },
    orderButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20
    },
    orderButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default OrderScreen;
