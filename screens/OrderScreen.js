import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

// Import các file đã tách
import { orderScreenStyles } from '../styles/OrderScreenStyles';
import HotelInfo from '../components/HotelInfo';
import BookingForm from '../components/BookingForm';
import RoomSelectionModal from '../components/RoomSelectionModal';
import DatePickerModal from '../components/DatePickerModal';
import { formatDateToVietnamese, calculateTotalPrice, validateOrder, createOrderData } from '../utils/orderUtils';
import { useOrderAnimations } from '../utils/useOrderAnimations';

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
    const { roomModalSlide, checkInModalScale, checkOutModalScale } = useOrderAnimations(
        showRoomModal, 
        showCheckInPicker, 
        showCheckOutPicker
    );

    const handleOrder = () => {
        if (!validateOrder(roomCount, selectedRoom, checkInDate, checkOutDate)) {
            return;
        }

        const totalPrice = calculateTotalPrice(selectedRoom, roomCount, checkInDate, checkOutDate);
        const orderData = createOrderData(place, selectedRoom, roomCount, checkInDate, checkOutDate, totalPrice);

        navigation.navigate('Payment', orderData);
    };

    const calculateTotal = () => {
        return calculateTotalPrice(selectedRoom, roomCount, checkInDate, checkOutDate);
    };

    return (
        <View style={orderScreenStyles.page}>
            {/* Custom Header */}
            <View style={orderScreenStyles.header}>
                <TouchableOpacity style={orderScreenStyles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={orderScreenStyles.backButtonText}>← Quay lại</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={orderScreenStyles.container} keyboardShouldPersistTaps="handled">
                <View style={orderScreenStyles.card}>
                    <HotelInfo 
                        place={place}
                        mainImage={mainImage}
                        setMainImage={setMainImage}
                        styles={orderScreenStyles}
                    />

                    <BookingForm
                        selectedRoom={selectedRoom}
                        setShowRoomModal={setShowRoomModal}
                        checkInDate={checkInDate}
                        checkOutDate={checkOutDate}
                        setShowCheckInPicker={setShowCheckInPicker}
                        setShowCheckOutPicker={setShowCheckOutPicker}
                        formatDateToVietnamese={formatDateToVietnamese}
                        roomCount={roomCount}
                        setRoomCount={setRoomCount}
                        calculateTotalPrice={calculateTotal}
                        handleOrder={handleOrder}
                        styles={orderScreenStyles}
                    />
                </View>
            </ScrollView>

            {/* Room Selection Modal */}
            <RoomSelectionModal
                showRoomModal={showRoomModal}
                setShowRoomModal={setShowRoomModal}
                place={place}
                selectedRoom={selectedRoom}
                setSelectedRoom={setSelectedRoom}
                roomModalSlide={roomModalSlide}
                styles={orderScreenStyles}
            />

            {/* Date Pickers Modal */}
            <DatePickerModal
                visible={showCheckInPicker}
                onClose={() => setShowCheckInPicker(false)}
                date={checkInDate}
                onDateChange={setCheckInDate}
                title="Chọn ngày Check-in"
                scaleAnim={checkInModalScale}
                styles={orderScreenStyles}
            />

            <DatePickerModal
                visible={showCheckOutPicker}
                onClose={() => setShowCheckOutPicker(false)}
                date={checkOutDate}
                onDateChange={setCheckOutDate}
                title="Chọn ngày Check-out"
                scaleAnim={checkOutModalScale}
                styles={orderScreenStyles}
            />
        </View>
    );
};

export default OrderScreen;
