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
import { homestaysScreenStyles } from '../styles/HomestaysScreenStyles';

const HomestaysScreen = ({ route, navigation }) => {
    const { city } = route.params || { city: 'Hồ Chí Minh' };
    const [homestays, setHomestays] = useState([]);
    const [filteredHomestays, setFilteredHomestays] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('default'); // default, price-low, price-high, rating
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHomestays();
    }, [city]);

    useEffect(() => {
        filterAndSortHomestays();
    }, [homestays, searchQuery, sortBy]);

    const fetchHomestays = async () => {
        try {
            setLoading(true);
            // Lấy từ collection 'hotels' nhưng filter chỉ lấy homestays
            const homestaysQuery = query(
                collection(firestore, 'hotels'),
                where('city', '==', city)
            );
            const querySnapshot = await getDocs(homestaysQuery);
            const homestaysList = querySnapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                .filter(hotel => {
                    // Chỉ lấy homestays, loại bỏ hotels thật sự
                    const name = hotel.hotelName?.toLowerCase() || '';
                    const type = hotel.type?.toLowerCase() || '';
                    return name.includes('homestay') || 
                           name.includes('nhà nghỉ') || 
                           type === 'homestay' ||
                           name.includes('guesthouse') ||
                           name.includes('hostel');
                });
            setHomestays(homestaysList);
        } catch (error) {
            console.error('Error fetching homestays:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortHomestays = () => {
        let filtered = homestays;

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = homestays.filter(homestay =>
                homestay.homestayName?.toLowerCase().includes(query) ||
                homestay.hotelName?.toLowerCase().includes(query) ||
                homestay.address?.toLowerCase().includes(query) ||
                homestay.amenities?.some(amenity => amenity.toLowerCase().includes(query))
            );
        }

        // Sort homestays
        switch (sortBy) {
            case 'price-low':
                filtered = [...filtered].sort((a, b) => {
                    const getLowestPrice = (homestay) => {
                        if (!homestay.rooms || homestay.rooms.length === 0) return Infinity;
                        const validPrices = homestay.rooms
                            .map(room => room.price || room.pricePerNight)
                            .filter(price => price && price > 0);
                        return validPrices.length > 0 ? Math.min(...validPrices) : Infinity;
                    };
                    return getLowestPrice(a) - getLowestPrice(b);
                });
                break;
            case 'price-high':
                filtered = [...filtered].sort((a, b) => {
                    const getLowestPrice = (homestay) => {
                        if (!homestay.rooms || homestay.rooms.length === 0) return 0;
                        const validPrices = homestay.rooms
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

        setFilteredHomestays(filtered);
    };

    const handleHomestayPress = (homestay) => {
        navigation.navigate('Order', { place: homestay });
    };

    const renderHomestay = ({ item }) => {
        // Tính giá thấp nhất từ tất cả rooms
        let lowestPrice = null;
        if (item.rooms && item.rooms.length > 0) {
            const validPrices = item.rooms
                .map(room => room.price || room.pricePerNight)
                .filter(price => price && price > 0);
            
            if (validPrices.length > 0) {
                lowestPrice = Math.min(...validPrices);
            }
        }

        const homestayName = item.homestayName || item.hotelName || 'Homestay';

        return (
            <TouchableOpacity
                style={homestaysScreenStyles.homestayCard}
                onPress={() => handleHomestayPress(item)}
            >
                {item.mainImage ? (
                    <Image
                        source={{ uri: item.mainImage }}
                        style={homestaysScreenStyles.homestayImage}
                        resizeMode="cover"
                    />
                ) : null}
                <View style={homestaysScreenStyles.homestayContent}>
                    <Text style={homestaysScreenStyles.homestayName}>{homestayName}</Text>
                    <Text style={homestaysScreenStyles.homestayLocation}>{item.address}</Text>
                    
                    {item.amenities && item.amenities.length > 0 ? (
                        <Text style={homestaysScreenStyles.homestayAmenities}>
                            {item.amenities.slice(0, 3).join(', ')}
                            {item.amenities.length > 3 ? '...' : ''}
                        </Text>
                    ) : null}

                    {item.rating ? (
                        <View style={homestaysScreenStyles.homestayRating}>
                            <Text style={homestaysScreenStyles.ratingText}>⭐ {item.rating}/5</Text>
                        </View>
                    ) : null}

                    {lowestPrice ? (
                        <Text style={homestaysScreenStyles.homestayPrice}>
                            Từ {lowestPrice.toLocaleString()} VND/đêm
                        </Text>
                    ) : null}
                </View>
            </TouchableOpacity>
        );
    };

    const renderEmptyState = () => (
        <View style={homestaysScreenStyles.emptyContainer}>
            <Text style={homestaysScreenStyles.emptyText}>
                {searchQuery ? 'Không tìm thấy homestay nào' : 'Chưa có homestay nào'}
            </Text>
            <Text style={homestaysScreenStyles.emptySubtext}>
                {searchQuery ? 'Thử tìm kiếm với từ khóa khác' : `trong thành phố ${city}`}
            </Text>
        </View>
    );

    if (loading) {
        return (
            <View style={homestaysScreenStyles.page}>
                <View style={homestaysScreenStyles.header}>
                    <TouchableOpacity 
                        style={homestaysScreenStyles.backButton} 
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={homestaysScreenStyles.backButtonText}>← Quay lại</Text>
                    </TouchableOpacity>
                </View>
                <View style={homestaysScreenStyles.emptyContainer}>
                    <ActivityIndicator size="large" color="#c026d3" />
                    <Text style={homestaysScreenStyles.emptyText}>Đang tải danh sách homestay...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={homestaysScreenStyles.page}>
            {/* Custom Header */}
            <View style={homestaysScreenStyles.header}>
                <TouchableOpacity 
                    style={homestaysScreenStyles.backButton} 
                    onPress={() => navigation.goBack()}
                >
                    <Text style={homestaysScreenStyles.backButtonText}>← Quay lại</Text>
                </TouchableOpacity>
            </View>

            <View style={homestaysScreenStyles.container}>
                {/* Search and Filter */}
                <View style={homestaysScreenStyles.searchContainer}>
                    <TextInput
                        style={homestaysScreenStyles.searchInput}
                        placeholder="Tìm kiếm homestay..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    
                    <View style={homestaysScreenStyles.filterRow}>
                        <TouchableOpacity
                            style={[
                                homestaysScreenStyles.filterButton,
                                sortBy === 'default' ? homestaysScreenStyles.filterButtonActive : null
                            ]}
                            onPress={() => setSortBy('default')}
                        >
                            <Text style={[
                                homestaysScreenStyles.filterButtonText,
                                sortBy === 'default' ? homestaysScreenStyles.filterButtonTextActive : null
                            ]}>
                                Mặc định
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={[
                                homestaysScreenStyles.filterButton,
                                sortBy === 'price-low' ? homestaysScreenStyles.filterButtonActive : null
                            ]}
                            onPress={() => setSortBy('price-low')}
                        >
                            <Text style={[
                                homestaysScreenStyles.filterButtonText,
                                sortBy === 'price-low' ? homestaysScreenStyles.filterButtonTextActive : null
                            ]}>
                                Giá thấp
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={[
                                homestaysScreenStyles.filterButton,
                                sortBy === 'price-high' ? homestaysScreenStyles.filterButtonTextActive : null
                            ]}
                            onPress={() => setSortBy('price-high')}
                        >
                            <Text style={[
                                homestaysScreenStyles.filterButtonText,
                                sortBy === 'price-high' ? homestaysScreenStyles.filterButtonTextActive : null
                            ]}>
                                Giá cao
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={[
                                homestaysScreenStyles.filterButton,
                                sortBy === 'rating' ? homestaysScreenStyles.filterButtonActive : null
                            ]}
                            onPress={() => setSortBy('rating')}
                        >
                            <Text style={[
                                homestaysScreenStyles.filterButtonText,
                                sortBy === 'rating' ? homestaysScreenStyles.filterButtonTextActive : null
                            ]}>
                                Đánh giá
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Homestays List */}
                <FlatList
                    data={filteredHomestays}
                    renderItem={renderHomestay}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={renderEmptyState}
                />
            </View>
        </View>
    );
};

export default HomestaysScreen;
