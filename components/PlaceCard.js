import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PlaceCard = ({ item, onPress, styles }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
            <Image source={{ uri: item.mainImage }} style={styles.placeImage} />
            <View style={styles.cardContent}>
                <Text style={styles.placeName}>{item.hotelName}</Text>
                <Text style={styles.amenities}>
                    {item.amenities && item.amenities.length > 0
                        ? item.amenities.slice(0, 3).join(', ') + (item.amenities.length > 3 ? '...' : '')
                        : 'No amenities available'}
                </Text>
                <Text style={styles.placeAddress}>{item.address || 'Không có địa chỉ'}</Text>
                <Text style={styles.placeRating}>
                    <Icon name="star" size={16} color="#f39c12" /> {item.rating ? `${item.rating} / 5` : 'Not rated yet'}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default PlaceCard;
