import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert,
} from 'react-native';
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
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.header}>Chi tiết thanh toán</Text>

            <View style={styles.detailsBox}>
                <Text style={styles.detailsText}>Khách sạn: {place.hotelName}</Text>
                <Text style={styles.detailsText}>Loại phòng: {selectedRoom.roomType}</Text>
                <Text style={styles.detailsText}>Số lượng phòng: {roomCount}</Text>
                <Text style={styles.detailsText}>
                    Ngày nhận phòng: {formatDateToVietnamese(checkInDate)}
                </Text>
                <Text style={styles.detailsText}>
                    Ngày trả phòng: {formatDateToVietnamese(checkOutDate)}
                </Text>
                <Text style={styles.detailsText}>
                    Tổng tiền: {totalPrice.toLocaleString()} VND
                </Text>
            </View>

            <Text style={styles.notice}>
                Vui lòng nhận phòng trước 12:00 trưa ngày nhận phòng và trả phòng trước 12:00
                trưa ngày trả phòng.
            </Text>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Họ và tên:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập họ và tên"
                    value={fullName}
                    onChangeText={setFullName}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Số điện thoại:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập số điện thoại"
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                />
            </View>

            <TouchableOpacity style={styles.paymentButton} onPress={handlePayment}>
                <Text style={styles.paymentButtonText}>Thanh toán khi nhận phòng</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#007AFF',
        marginBottom: 20,
    },
    detailsBox: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    detailsText: {
        fontSize: 16,
        marginBottom: 10,
        color: '#333',
    },
    notice: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#fff',
        elevation: 1,
    },
    paymentButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 3,
    },
    paymentButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default PaymentScreen;
