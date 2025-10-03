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
    Modal,
    Alert,
    ActivityIndicator,
    Animated,
    ImageBackground,
} from 'react-native';
import { firestore, auth } from '../firebase';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CityDetailsScreen = ({ route, navigation }) => {
    const { city } = route.params;
    const [hotels, setHotels] = useState([]);
    const [homestays, setHomestays] = useState([]);
    const [username, setUsername] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredHotels, setFilteredHotels] = useState([]);
    const [filteredHomestays, setFilteredHomestays] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [availableCities, setAvailableCities] = useState([]);
    const [showCityModal, setShowCityModal] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);
    const [accountModalAnim] = useState(new Animated.Value(0));
    const [cityModalAnim] = useState(new Animated.Value(0));
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
                setFilteredHotels(hotelList);
                setFilteredHomestays(homestayList);
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

        const fetchCities = async () => {
            try {
                const querySnapshot = await getDocs(collection(firestore, 'hotels'));
                const cityList = [];
                querySnapshot.forEach((doc) => {
                    const cityName = doc.data().city;
                    if (cityName && !cityList.includes(cityName)) {
                        cityList.push(cityName);
                    }
                });
                setAvailableCities(cityList);
            } catch (error) {
                console.error('Error fetching cities:', error);
            }
        };

        fetchPlaces();
        fetchUsername();
        fetchCities();
    }, [city]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigation.navigate('LoginScreen');
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể đăng xuất. Vui lòng thử lại.');
        }
    };

    const handleCityChange = (newCity) => {
        setShowCityModal(false);
        navigation.navigate('CityDetailsScreen', { city: newCity });
    };

    const openCityModal = async () => {
        setShowAccountModal(false);
        setLoadingCities(true);
        setShowCityModal(true);
        Animated.timing(cityModalAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
        setLoadingCities(false);
    };

    const closeAccountModal = () => {
        Animated.timing(accountModalAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setShowAccountModal(false);
        });
    };

    const closeCityModal = () => {
        Animated.timing(cityModalAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setShowCityModal(false);
        });
    };

    const openAccountModal = () => {
        setShowAccountModal(true);
        Animated.timing(accountModalAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            const filteredH = hotels.filter(hotel =>
                hotel.hotelName.toLowerCase().includes(searchQuery.toLowerCase())
            );
            const filteredHm = homestays.filter(homestay =>
                homestay.hotelName.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredHotels(filteredH);
            setFilteredHomestays(filteredHm);
            setHasSearched(true);
        } else {
            setFilteredHotels(hotels);
            setFilteredHomestays(homestays);
            setHasSearched(false);
        }
    };

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
        <ImageBackground
            source={{ uri: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InVybCgjZ3JhZGllbnQwX2xpbmVhcl8xXzEpIi8+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudDBfbGluZWFyXzFfMSIgeDE9IjAiIHkxPSIwIiB4Mj0iMCIgeTI9IjEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBzdG9wLWNvbG9yPSIjZmRmMmY4Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmZmZmZmIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PC9zdmc+' }}
            style={styles.page}
        >
            <ScrollView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <View>
                            <Text style={styles.headerText}>Chào, {username || 'Guest'}</Text>
                            <Text style={styles.locationText}>{city}, Việt Nam</Text>
                            <Text style={styles.dateText}>Ngày: {currentDate}</Text>
                        </View>
                        <View style={styles.headerActions}>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => navigation.navigate('AIChat', { city })}
                            >
                                <Icon name="smart-toy" size={24} color="#34C759" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.accountButton}
                                onPress={openAccountModal}
                            >
                                <Icon name="account-circle" size={32} color="#c026d3" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            {/* Search Section */}
            <View style={styles.searchSection}>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Tìm kiếm khách sạn"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#9aa3af"
                    />
                    <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                        <Icon name="search" size={20} color="#ffffff" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Hotels */}
            <Text style={styles.sectionTitle}>Hotels</Text>
            {hotels.length > 0 ? (
                <FlatList
                    data={hasSearched ? filteredHotels : hotels}
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
                    data={hasSearched ? filteredHomestays : homestays}
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

            {/* Account Modal */}
            <Modal
                visible={showAccountModal}
                transparent={true}
                animationType="none"
                onRequestClose={closeAccountModal}
            >
                <View style={styles.modalOverlay}>
                    <Animated.View style={[
                        styles.modalContent,
                        {
                            transform: [{
                                translateY: accountModalAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [400, 0],
                                })
                            }]
                        }
                    ]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Tài khoản</Text>
                            <TouchableOpacity 
                                style={styles.modalCloseButton}
                                onPress={closeAccountModal}
                            >
                                <Icon name="close" size={24} color="#6b7280" />
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.modalBody}>
                            <View style={styles.userInfo}>
                                <Icon name="account-circle" size={48} color="#c026d3" />
                                <Text style={styles.userName}>{username || 'Guest'}</Text>
                                <Text style={styles.userLocation}>Hiện tại: {city}</Text>
                            </View>

                            <TouchableOpacity
                                style={styles.cityPickerButton}
                                onPress={openCityModal}
                            >
                                <Text style={styles.cityPickerText}>Thay đổi thành phố</Text>
                                <Text style={styles.cityPickerArrow}>▼</Text>
                            </TouchableOpacity>

                            <View style={styles.modalActions}>
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => navigation.navigate('BookingManagementScreen')}
                                >
                                    <Icon name="shopping-cart" size={20} color="#007AFF" />
                                    <Text style={styles.actionButtonText}>Đơn đặt phòng</Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.logoutButton]}
                                    onPress={handleLogout}
                                >
                                    <Icon name="logout" size={20} color="#ef4444" />
                                    <Text style={[styles.actionButtonText, styles.logoutText]}>Đăng xuất</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Animated.View>
                </View>
            </Modal>

            {/* City Selection Modal */}
            <Modal
                visible={showCityModal}
                transparent={true}
                animationType="none"
                onRequestClose={closeCityModal}
            >
                <View style={styles.modalOverlay}>
                    <Animated.View style={[
                        styles.modalContent,
                        {
                            transform: [{
                                translateY: cityModalAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [400, 0],
                                })
                            }]
                        }
                    ]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Chọn thành phố</Text>
                            <TouchableOpacity 
                                style={styles.modalCloseButton}
                                onPress={closeCityModal}
                            >
                                <Icon name="close" size={24} color="#6b7280" />
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.modalBody}>
                            {loadingCities ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color="#c026d3" />
                                    <Text style={styles.loadingText}>Đang tải danh sách thành phố...</Text>
                                </View>
                            ) : (
                                <ScrollView style={styles.cityList}>
                                    {availableCities.map((cityName, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[
                                                styles.cityItem,
                                                city === cityName && styles.cityItemSelected
                                            ]}
                                            onPress={() => handleCityChange(cityName)}
                                        >
                                            <Text style={[
                                                styles.cityItemText,
                                                city === cityName && styles.cityItemTextSelected
                                            ]}>
                                                {cityName}
                                            </Text>
                                            {city === cityName && (
                                                <Icon name="check" size={20} color="#c026d3" />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            )}
                        </View>
                    </Animated.View>
                </View>
            </Modal>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    page: { 
        flex: 1, 
        backgroundColor: '#fdf2f8',
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 50, // Add padding to avoid status bar
    },
    header: {
        paddingVertical: 20,
        paddingHorizontal: 0,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    headerText: {
        fontSize: 28,
        fontWeight: '900',
        color: '#0f172a',
        marginBottom: 4,
    },
    locationText: {
        fontSize: 16,
        color: '#c026d3',
        marginBottom: 2,
    },
    dateText: {
        fontSize: 14,
        color: '#64748b',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    actionButton: {
        padding: 8,
    },
    accountButton: {
        padding: 8,
    },
    searchSection: {
        marginBottom: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        padding: 14,
        fontSize: 16,
        color: '#0f172a',
    },
    searchButton: {
        backgroundColor: '#c026d3',
        padding: 12,
        marginRight: 4,
        borderRadius: 8,
        marginLeft: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 12,
        color: '#0f172a',
    },
    flatListContent: {
        paddingHorizontal: 5,
    },
    card: {
        width: 220,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        marginHorizontal: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    placeImage: {
        width: '100%',
        height: 130,
    },
    cardContent: {
        padding: 12,
    },
    placeName: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 6,
        color: '#0f172a',
    },
    amenities: {
        fontSize: 14,
        color: '#c026d3',
        marginBottom: 6,
    },
    placeAddress: {
        fontSize: 13,
        color: '#64748b',
        marginBottom: 6,
    },
    placeRating: {
        fontSize: 14,
        color: '#f59e0b',
        fontWeight: '600',
    },
    noDataText: {
        fontSize: 14,
        color: '#9ca3af',
        textAlign: 'center',
        marginVertical: 20,
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0f172a',
    },
    modalCloseButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBody: {
        padding: 20,
    },
    userInfo: {
        alignItems: 'center',
        marginBottom: 24,
    },
    userName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a',
        marginTop: 8,
        marginBottom: 4,
    },
    userLocation: {
        fontSize: 14,
        color: '#64748b',
    },
    modalSection: {
        marginBottom: 24,
    },
    cityList: {
        maxHeight: 200,
    },
    cityItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    cityItemSelected: {
        backgroundColor: '#f8fafc',
    },
    cityItemText: {
        fontSize: 16,
        color: '#0f172a',
    },
    cityItemTextSelected: {
        color: '#c026d3',
        fontWeight: '600',
    },
    modalActions: {
        gap: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    actionButtonText: {
        fontSize: 16,
        color: '#0f172a',
        marginLeft: 12,
        fontWeight: '500',
    },
    logoutButton: {
        backgroundColor: '#fef2f2',
        borderColor: '#fecaca',
    },
    logoutText: {
        color: '#ef4444',
    },
    // City picker styles
    cityPickerButton: {
        height: 50,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 14,
        marginBottom: 20,
    },
    cityPickerText: {
        fontSize: 16,
        color: '#0f172a',
    },
    cityPickerArrow: {
        fontSize: 12,
        color: '#9aa3af',
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#64748b',
    },
});

export default CityDetailsScreen;
