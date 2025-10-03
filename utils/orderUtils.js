import { Alert } from 'react-native';

export const formatDateToVietnamese = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.toLocaleString('vi-VN', { month: 'short' });
    const year = d.getFullYear();
    return {
        day: day,
        monthYear: `${month} ${year}`
    };
};

export const calculateTotalPrice = (selectedRoom, roomCount, checkInDate, checkOutDate) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(
        Math.abs((checkOutDate - checkInDate) / oneDay)
    );
    return selectedRoom.price * roomCount * (diffDays || 1);
};

export const validateOrder = (roomCount, selectedRoom, checkInDate, checkOutDate) => {
    if (roomCount > selectedRoom.available) {
        Alert.alert(
            'Not enough rooms available',
            `Only ${selectedRoom.available} room(s) left for the selected type.`
        );
        return false;
    }

    if (checkInDate >= checkOutDate) {
        Alert.alert('Invalid Dates', 'Check-out date must be after check-in date.');
        return false;
    }

    return true;
};

export const createOrderData = (place, selectedRoom, roomCount, checkInDate, checkOutDate, totalPrice) => {
    return {
        place,
        selectedRoom,
        roomCount,
        checkInDate: checkInDate.toISOString(),
        checkOutDate: checkOutDate.toISOString(),
        totalPrice,
    };
};
