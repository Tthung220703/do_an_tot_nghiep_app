import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { paymentScreenStyles } from '../styles/PaymentScreenStyles';
import { firestore } from '../firebase';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const PaymentScreen = ({ route, navigation }) => {
    const {
        place,
        selectedRoom,
        roomCount,
        checkInDate,
        checkOutDate,
        totalPrice,
    } = route.params;

    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const formatDateToVietnamese = (date) => {
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        return new Intl.DateTimeFormat('vi-VN', options).format(new Date(date));
    };

    const handlePayment = async () => {
        if (!fullName.trim() || !phoneNumber.trim()) {
            Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ họ tên và số điện thoại!');
            return;
        }

        try {
            const auth = getAuth();
            const currentUser = auth.currentUser;

            if (!currentUser) {
                Alert.alert('Lỗi', 'Bạn cần đăng nhập để thực hiện hành động này.');
                return;
            }

            const userId = currentUser.uid;

            const hotelRef = doc(firestore, 'hotels', place.id);
            const hotelSnapshot = await getDoc(hotelRef);

            if (!hotelSnapshot.exists()) {
                Alert.alert('Lỗi', 'Không tìm thấy khách sạn.');
                return;
            }

            const hotelData = hotelSnapshot.data();
            const hotelOwnerId = hotelData.userId;

            await addDoc(collection(firestore, 'orders'), {
                hotelId: place.id,
                hotelName: place.hotelName,
                userId: userId,
                hotelOwnerId: hotelOwnerId,
                userName: fullName,
                phoneNumber: phoneNumber,
                email: currentUser.email,
                checkInDate: checkInDate,
                checkOutDate: checkOutDate,
                roomType: selectedRoom.roomType,
                roomCount: roomCount,
                totalPrice: totalPrice,
                status: 'Đang chờ duyệt',
                createdAt: new Date().toISOString(),
            });

            Alert.alert('Thành công', 'Đặt phòng của bạn đã được gửi đi!');
            navigation.navigate('BookingManagementScreen');
        } catch (error) {
            console.error('Lỗi khi thanh toán:', error.code, error.message);
            Alert.alert('Lỗi', `Có lỗi xảy ra khi xử lý thanh toán: ${error.message}`);
        }
    };

    return (
        <View style={paymentScreenStyles.page}>
            {/* Custom Header */}
            <View style={paymentScreenStyles.header}>
                <TouchableOpacity style={paymentScreenStyles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={paymentScreenStyles.backButtonText}>← Quay lại</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={paymentScreenStyles.container} keyboardShouldPersistTaps="handled">
                <View style={paymentScreenStyles.card}>
                    <Text style={paymentScreenStyles.title}>Chi tiết thanh toán</Text>

                    <View style={paymentScreenStyles.detailsBox}>
                        <Text style={paymentScreenStyles.detailsText}>Khách sạn: {place.hotelName}</Text>
                        <Text style={paymentScreenStyles.detailsText}>Loại phòng: {selectedRoom.roomType}</Text>
                        <Text style={paymentScreenStyles.detailsText}>Số lượng phòng: {roomCount}</Text>
                        <Text style={paymentScreenStyles.detailsText}>Ngày nhận phòng: {formatDateToVietnamese(checkInDate)}</Text>
                        <Text style={paymentScreenStyles.detailsText}>Ngày trả phòng: {formatDateToVietnamese(checkOutDate)}</Text>
                        <Text style={paymentScreenStyles.detailsText}>Tổng tiền: {totalPrice.toLocaleString()} VND</Text>
                    </View>

                    <Text style={paymentScreenStyles.notice}>
                        Vui lòng nhận phòng trước 12:00 trưa ngày nhận phòng và trả phòng trước 12:00 trưa ngày trả phòng.
                    </Text>

                    <View style={paymentScreenStyles.inputGroup}>
                        <Text style={paymentScreenStyles.inputLabel}>Họ và tên:</Text>
                        <TextInput
                            style={paymentScreenStyles.input}
                            placeholder="Nhập họ và tên"
                            value={fullName}
                            onChangeText={setFullName}
                        />
                    </View>

                    <View style={paymentScreenStyles.inputGroup}>
                        <Text style={paymentScreenStyles.inputLabel}>Số điện thoại:</Text>
                        <TextInput
                            style={paymentScreenStyles.input}
                            placeholder="Nhập số điện thoại"
                            keyboardType="phone-pad"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                        />
                    </View>

                    <TouchableOpacity onPress={handlePayment} style={paymentScreenStyles.primaryBtn}>
                        <Text style={paymentScreenStyles.primaryBtnText}>Thanh toán khi nhận phòng</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};
export default PaymentScreen;
