import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';

const HotelInfo = ({ place, mainImage, setMainImage, styles }) => {
    return (
        <>
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
        </>
    );
};

export default HotelInfo;
