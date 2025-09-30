import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { firestore } from '../firebase';
import { getAuth } from 'firebase/auth';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

const BookingManagementScreen = () => {
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
            <View style={styles.bookingItem}>
                <View style={styles.bookingHeader}>
                    <Text style={styles.hotelName}>{item.hotelName}</Text>
                    {item.status === 'Đang chờ duyệt' && (
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => handleCancelBooking(item.id, item.status)}
                        >
                            <Text style={styles.cancelButtonText}>Hủy</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <Text style={styles.bookingDetail}>
                    Loại phòng: <Text style={styles.boldText}>{item.roomType}</Text>
                </Text>
                <Text style={styles.bookingDetail}>
                    Số lượng phòng: <Text style={styles.boldText}>{item.roomCount}</Text>
                </Text>
                <Text style={styles.bookingDetail}>
                    Giá: <Text style={styles.boldText}>{item.totalPrice.toLocaleString()} VND</Text>
                </Text>
                <Text style={styles.bookingDetail}>
                    Số ngày ở: <Text style={styles.boldText}>{numberOfDays} ngày</Text>
                </Text>
                <Text style={styles.bookingDetail}>
                    Trạng thái: <Text style={styles.statusText}>{item.status}</Text>
                </Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Quản lý phòng đã đặt</Text>
            <TouchableOpacity style={styles.aiButton} onPress={() => {
                // navigation is available via props in stack screens
                // but this component defined without props; use a workaround by requiring navigation
            }} />
            {bookings.length === 0 ? (
                <Text style={styles.noBookingText}>Bạn chưa đặt phòng nào.</Text>
            ) : (
                <FlatList
                    data={bookings}
                    renderItem={renderBooking}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: '#007AFF',
    },
    listContainer: {
        paddingBottom: 16,
    },
    bookingItem: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    bookingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    hotelName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    cancelButton: {
        backgroundColor: '#FF3B30',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    cancelButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    bookingDetail: {
        fontSize: 16,
        color: '#555',
        marginBottom: 4,
    },
    boldText: {
        fontWeight: 'bold',
        color: '#000',
    },
    statusText: {
        fontWeight: 'bold',
        color: '#007AFF',
    },
    noBookingText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#888',
        marginTop: 20,
    },
    aiButton: {
        display: 'none'
    }
});

export default BookingManagementScreen;
