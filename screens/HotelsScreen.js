import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    TextInput,
    Image,
    ActivityIndicator,
} from 'react-native';
import { firestore } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { hotelsScreenStyles } from '../styles/HotelsScreenStyles';

const HotelsScreen = ({ route, navigation }) => {
    const { city } = route.params || { city: 'Hồ Chí Minh' };
    const [hotels, setHotels] = useState([]);
    const [filteredHotels, setFilteredHotels] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('default'); // default, price-low, price-high, rating
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHotels();
    }, [city]);

    useEffect(() => {
        filterAndSortHotels();
    }, [hotels, searchQuery, sortBy]);

    const fetchHotels = async () => {
        try {
            setLoading(true);
            const hotelsQuery = query(
                collection(firestore, 'hotels'),
                where('city', '==', city)
            );
            const querySnapshot = await getDocs(hotelsQuery);
            const hotelsList = querySnapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                .filter(hotel => {
                    // Chỉ lấy hotels thật sự, loại bỏ homestays
                    const name = hotel.hotelName?.toLowerCase() || '';
                    const type = hotel.type?.toLowerCase() || '';
                    return !name.includes('homestay') && 
                           !name.includes('nhà nghỉ') && 
                           type !== 'homestay';
                });
            setHotels(hotelsList);
        } catch (error) {
            console.error('Error fetching hotels:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortHotels = () => {
        let filtered = hotels;

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = hotels.filter(hotel =>
                hotel.hotelName.toLowerCase().includes(query) ||
                hotel.address?.toLowerCase().includes(query) ||
                hotel.amenities?.some(amenity => amenity.toLowerCase().includes(query))
            );
        }

        // Sort hotels
        switch (sortBy) {
            case 'price-low':
                filtered = [...filtered].sort((a, b) => {
                    const getLowestPrice = (hotel) => {
                        if (!hotel.rooms || hotel.rooms.length === 0) return Infinity;
                        const validPrices = hotel.rooms
                            .map(room => room.price || room.pricePerNight)
                            .filter(price => price && price > 0);
                        return validPrices.length > 0 ? Math.min(...validPrices) : Infinity;
                    };
                    return getLowestPrice(a) - getLowestPrice(b);
                });
                break;
            case 'price-high':
                filtered = [...filtered].sort((a, b) => {
                    const getLowestPrice = (hotel) => {
                        if (!hotel.rooms || hotel.rooms.length === 0) return 0;
                        const validPrices = hotel.rooms
                            .map(room => room.price || room.pricePerNight)
                            .filter(price => price && price > 0);
                        return validPrices.length > 0 ? Math.min(...validPrices) : 0;
                    };
                    return getLowestPrice(b) - getLowestPrice(a);
                });
                break;
            case 'rating':
                filtered = [...filtered].sort((a, b) => {
                    const ratingA = a.rating || 0;
                    const ratingB = b.rating || 0;
                    return ratingB - ratingA;
                });
                break;
            default:
                // Keep original order
                break;
        }

        setFilteredHotels(filtered);
    };

    const handleHotelPress = (hotel) => {
        navigation.navigate('Order', { place: hotel });
    };

    const renderHotel = ({ item }) => {
        // Tính giá thấp nhất từ tất cả rooms
        let lowestPrice = null;
        if (item.rooms && item.rooms.length > 0) {
            const validPrices = item.rooms
                .map(room => room.price || room.pricePerNight) // Hỗ trợ cả price và pricePerNight
                .filter(price => price && price > 0);
            
            if (validPrices.length > 0) {
                lowestPrice = Math.min(...validPrices);
            }
        }

        return (
            <TouchableOpacity
                style={hotelsScreenStyles.hotelCard}
                onPress={() => handleHotelPress(item)}
            >
                {item.mainImage ? (
                    <Image
                        source={{ uri: item.mainImage }}
                        style={hotelsScreenStyles.hotelImage}
                        resizeMode="cover"
                    />
                ) : null}
                <View style={hotelsScreenStyles.hotelContent}>
                    <Text style={hotelsScreenStyles.hotelName}>{item.hotelName}</Text>
                    <Text style={hotelsScreenStyles.hotelLocation}>{item.address}</Text>
                    
                    {item.amenities && item.amenities.length > 0 ? (
                        <Text style={hotelsScreenStyles.hotelAmenities}>
                            {item.amenities.slice(0, 3).join(', ')}
                            {item.amenities.length > 3 ? '...' : ''}
                        </Text>
                    ) : null}

                    {item.rating ? (
                        <View style={hotelsScreenStyles.hotelRating}>
                            <Text style={hotelsScreenStyles.ratingText}>⭐ {item.rating}/5</Text>
                        </View>
                    ) : null}

                    {lowestPrice ? (
                        <Text style={hotelsScreenStyles.hotelPrice}>
                            Từ {lowestPrice.toLocaleString()} VND/đêm
                        </Text>
                    ) : null}
                </View>
            </TouchableOpacity>
        );
    };

    const renderEmptyState = () => (
        <View style={hotelsScreenStyles.emptyContainer}>
            <Text style={hotelsScreenStyles.emptyText}>
                {searchQuery ? 'Không tìm thấy khách sạn nào' : 'Chưa có khách sạn nào'}
            </Text>
            <Text style={hotelsScreenStyles.emptySubtext}>
                {searchQuery ? 'Thử tìm kiếm với từ khóa khác' : `trong thành phố ${city}`}
            </Text>
        </View>
    );

    if (loading) {
        return (
            <View style={hotelsScreenStyles.page}>
                <View style={hotelsScreenStyles.header}>
                    <TouchableOpacity 
                        style={hotelsScreenStyles.backButton} 
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={hotelsScreenStyles.backButtonText}>← Quay lại</Text>
                    </TouchableOpacity>
                </View>
                <View style={hotelsScreenStyles.emptyContainer}>
                    <ActivityIndicator size="large" color="#c026d3" />
                    <Text style={hotelsScreenStyles.emptyText}>Đang tải danh sách khách sạn...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={hotelsScreenStyles.page}>
            {/* Custom Header */}
            <View style={hotelsScreenStyles.header}>
                <TouchableOpacity 
                    style={hotelsScreenStyles.backButton} 
                    onPress={() => navigation.goBack()}
                >
                    <Text style={hotelsScreenStyles.backButtonText}>← Quay lại</Text>
                </TouchableOpacity>
            </View>

            <View style={hotelsScreenStyles.container}>
                {/* Search and Filter */}
                <View style={hotelsScreenStyles.searchContainer}>
                    <TextInput
                        style={hotelsScreenStyles.searchInput}
                        placeholder="Tìm kiếm khách sạn..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    
                    <View style={hotelsScreenStyles.filterRow}>
                        <TouchableOpacity
                            style={[
                                hotelsScreenStyles.filterButton,
                                sortBy === 'default' ? hotelsScreenStyles.filterButtonActive : null
                            ]}
                            onPress={() => setSortBy('default')}
                        >
                            <Text style={[
                                hotelsScreenStyles.filterButtonText,
                                sortBy === 'default' ? hotelsScreenStyles.filterButtonTextActive : null
                            ]}>
                                Mặc định
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={[
                                hotelsScreenStyles.filterButton,
                                sortBy === 'price-low' ? hotelsScreenStyles.filterButtonActive : null
                            ]}
                            onPress={() => setSortBy('price-low')}
                        >
                            <Text style={[
                                hotelsScreenStyles.filterButtonText,
                                sortBy === 'price-low' ? hotelsScreenStyles.filterButtonTextActive : null
                            ]}>
                                Giá thấp
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={[
                                hotelsScreenStyles.filterButton,
                                sortBy === 'price-high' ? hotelsScreenStyles.filterButtonActive : null
                            ]}
                            onPress={() => setSortBy('price-high')}
                        >
                            <Text style={[
                                hotelsScreenStyles.filterButtonText,
                                sortBy === 'price-high' ? hotelsScreenStyles.filterButtonTextActive : null
                            ]}>
                                Giá cao
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={[
                                hotelsScreenStyles.filterButton,
                                sortBy === 'rating' ? hotelsScreenStyles.filterButtonActive : null
                            ]}
                            onPress={() => setSortBy('rating')}
                        >
                            <Text style={[
                                hotelsScreenStyles.filterButtonText,
                                sortBy === 'rating' ? hotelsScreenStyles.filterButtonTextActive : null
                            ]}>
                                Đánh giá
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Hotels List */}
                <FlatList
                    data={filteredHotels}
                    renderItem={renderHotel}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={renderEmptyState}
                />
            </View>
        </View>
    );
};

export default HotelsScreen;
