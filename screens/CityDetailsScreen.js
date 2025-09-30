import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { firestore, auth } from '../firebase';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CityDetailsScreen = ({ route, navigation }) => {
    const { city } = route.params;
    const [hotels, setHotels] = useState([]);
    const [homestays, setHomestays] = useState([]);
    const [username, setUsername] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const currentDate = new Date().toLocaleDateString();

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const hotelsRef = collection(firestore, 'hotels');
                const q = query(hotelsRef, where('city', '==', city));
                const querySnapshot = await getDocs(q);

                const hotelList = [];
                const homestayList = [];

                querySnapshot.docs.forEach((doc) => {
                    const data = doc.data();
                    if (data.type === 'hotel') hotelList.push({ id: doc.id, ...data });
                    if (data.type === 'homestay') homestayList.push({ id: doc.id, ...data });
                });

                setHotels(hotelList);
                setHomestays(homestayList);
            } catch (error) {
                console.error('Error fetching places:', error);
            }
        };

        const fetchUsername = async () => {
            try {
                const userId = auth.currentUser?.uid;
                if (!userId) {
                    console.log('No user is logged in');
                    return;
                }

                const userRef = doc(firestore, 'users', userId);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    setUsername(userData.username);
                } else {
                    console.log('No user document found!');
                }
            } catch (error) {
                console.error('Error fetching username:', error);
            }
        };

        fetchPlaces();
        fetchUsername();
    }, [city]);

    const renderPlace = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => handlePress(item)}>
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

    const handlePress = (item) => {
        navigation.navigate('Order', { place: item });
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Chào, {username || 'Guest'}</Text>
                <View style={styles.headerActions}>
                    <Text style={styles.locationText}>{city}, Việt Nam</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                            style={[styles.actionIcon, { marginRight: 8 }]}
                            onPress={() => navigation.navigate('AIChat', { city })}
                        >
                            <Icon name="smart-toy" size={24} color="#34C759" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionIcon}
                            onPress={() => navigation.navigate('BookingManagementScreen')}
                        >
                            <Icon name="shopping-cart" size={24} color="#007AFF" />
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={styles.dateText}>Ngày: {currentDate}</Text>
            </View>

            {/* Search Bar */}
            <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm khách sạn"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            {/* Hotels */}
            <Text style={styles.sectionTitle}>Hotels</Text>
            {hotels.length > 0 ? (
                <FlatList
                    data={hotels.filter((hotel) =>
                        hotel.hotelName.toLowerCase().includes(searchQuery.toLowerCase())
                    )}
                    renderItem={renderPlace}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.flatListContent}
                />
            ) : (
                <Text style={styles.noDataText}>Chưa có hotels.</Text>
            )}

            {/* Homestays */}
            <Text style={styles.sectionTitle}>Homestays</Text>
            {homestays.length > 0 ? (
                <FlatList
                    data={homestays.filter((homestay) =>
                        homestay.hotelName.toLowerCase().includes(searchQuery.toLowerCase())
                    )}
                    renderItem={renderPlace}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.flatListContent}
                />
            ) : (
                <Text style={styles.noDataText}>Chưa có homestays.</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        backgroundColor: '#f5f5f5',
    },
    header: {
        marginBottom: 10,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    actionIcon: {
        padding: 5,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    locationText: {
        fontSize: 14,
        color: '#007AFF',
    },
    dateText: {
        fontSize: 14,
        color: '#555',
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        marginLeft: 10,
    },
    flatListContent: {
        paddingHorizontal: 5,
    },
    card: {
        width: 220,
        borderRadius: 15,
        overflow: 'hidden',
        backgroundColor: '#fff',
        marginHorizontal: 10,
        marginBottom: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
    },
    placeImage: {
        width: '100%',
        height: 130,
    },
    cardContent: {
        padding: 10,
    },
    placeName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333',
    },
    amenities: {
        fontSize: 14,
        color: '#007AFF',
        marginBottom: 4,
    },
    placeAddress: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    placeRating: {
        fontSize: 14,
        color: '#f39c12',
    },
    noDataText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        marginVertical: 10,
    },
});

export default CityDetailsScreen;
