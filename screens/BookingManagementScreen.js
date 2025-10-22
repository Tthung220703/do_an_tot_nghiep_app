import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Alert,
    ScrollView,
} from 'react-native';
import { firestore } from '../firebase';
import { getAuth } from 'firebase/auth';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { bookingManagementScreenStyles } from '../styles/BookingManagementScreenStyles';

const BookingManagementScreen = ({ navigation, route }) => {
    const { city } = route.params || { city: 'Hồ Chí Minh' }; // fallback nếu không có params
    const [bookings, setBookings] = useState([]);
    const auth = getAuth();
    const currentUser = auth.currentUser;

    useEffect(() => {
        if (currentUser) {
            const q = query(
                collection(firestore, 'orders'),
                where('userId', '==', currentUser.uid)
            );

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const fetchedBookings = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setBookings(fetchedBookings);
            });

            return () => unsubscribe();
        }
    }, [currentUser]);

    const handleCancelBooking = async (bookingId, status) => {
        if (status !== 'Đang chờ duyệt') {
            Alert.alert('Thông báo', 'Bạn chỉ có thể hủy đơn đặt phòng khi trạng thái là "Đang chờ duyệt".');
            return;
        }

        try {
            await deleteDoc(doc(firestore, 'orders', bookingId));
            Alert.alert('Thành công', 'Đơn đặt phòng đã được hủy.');
        } catch (error) {
            console.error('Lỗi khi hủy đơn đặt phòng:', error);
            Alert.alert('Lỗi', 'Có lỗi xảy ra khi hủy đơn đặt phòng.');
        }
    };

    const renderBooking = ({ item }) => {
        const checkInDate = new Date(item.checkInDate);
        const checkOutDate = new Date(item.checkOutDate);
        const numberOfDays = Math.ceil(
            (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
        );

        return (
            <View style={bookingManagementScreenStyles.bookingItem}>
                <View style={bookingManagementScreenStyles.bookingHeader}>
                    <Text style={bookingManagementScreenStyles.hotelName}>{item.hotelName}</Text>
                    {item.status === 'Đang chờ duyệt' && (
                        <TouchableOpacity
                            style={bookingManagementScreenStyles.cancelButton}
                            onPress={() => handleCancelBooking(item.id, item.status)}
                        >
                            <Text style={bookingManagementScreenStyles.cancelButtonText}>Hủy</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <Text style={bookingManagementScreenStyles.bookingDetail}>
                    Loại phòng: <Text style={bookingManagementScreenStyles.boldText}>{item.roomType}</Text>
                </Text>
                <Text style={bookingManagementScreenStyles.bookingDetail}>
                    Số lượng phòng: <Text style={bookingManagementScreenStyles.boldText}>{item.roomCount}</Text>
                </Text>
                <Text style={bookingManagementScreenStyles.bookingDetail}>
                    Giá: <Text style={bookingManagementScreenStyles.boldText}>{item.totalPrice.toLocaleString()} VND</Text>
                </Text>
                <Text style={bookingManagementScreenStyles.bookingDetail}>
                    Số ngày ở: <Text style={bookingManagementScreenStyles.boldText}>{numberOfDays} ngày</Text>
                </Text>
                <Text style={bookingManagementScreenStyles.bookingDetail}>
                    Trạng thái: <Text style={bookingManagementScreenStyles.statusText}>{item.status}</Text>
                </Text>
            </View>
        );
    };

    return (
        <View style={bookingManagementScreenStyles.page}>
            {/* Custom Header */}
            <View style={bookingManagementScreenStyles.header}>
                <TouchableOpacity 
                    style={bookingManagementScreenStyles.backButton} 
                    onPress={() => navigation.navigate('CityDetailsScreen', { city })}
                >
                    <Text style={bookingManagementScreenStyles.backButtonText}>← Quay lại</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={bookingManagementScreenStyles.container} keyboardShouldPersistTaps="handled">
                <View style={bookingManagementScreenStyles.card}>
                    <Text style={bookingManagementScreenStyles.title}>Quản lý phòng đã đặt</Text>
                    
                    {bookings.length === 0 ? (
                        <Text style={bookingManagementScreenStyles.noBookingText}>Bạn chưa đặt phòng nào.</Text>
                    ) : (
                        <FlatList
                            data={bookings}
                            renderItem={renderBooking}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={bookingManagementScreenStyles.listContainer}
                            scrollEnabled={false}
                        />
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

export default BookingManagementScreen;
