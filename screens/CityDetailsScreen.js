import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    ScrollView,
    TouchableOpacity,
    Modal,
    Alert,
    ActivityIndicator,
    Animated,
} from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import các file đã tách
import { cityDetailsStyles } from '../styles/CityDetailsScreenStyles';
import PlaceCard from '../components/PlaceCard';
import SearchBar from '../components/SearchBar';
import { fetchPlaces, fetchUsername, fetchCities, handleSearch } from '../utils/cityDetailsUtils';

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
        const loadData = async () => {
            const { hotels: hotelList, homestays: homestayList } = await fetchPlaces(city);
            const usernameData = await fetchUsername();
            const citiesData = await fetchCities();

            setHotels(hotelList);
            setHomestays(homestayList);
            setFilteredHotels(hotelList);
            setFilteredHomestays(homestayList);
            setUsername(usernameData);
            setAvailableCities(citiesData);
        };

        loadData();
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

    const onSearch = () => {
        const result = handleSearch(searchQuery, hotels, homestays);
        setFilteredHotels(result.filteredHotels);
        setFilteredHomestays(result.filteredHomestays);
        setHasSearched(result.hasSearched);
    };

    const handlePress = (item) => {
        navigation.navigate('Order', { place: item });
    };

    const renderPlace = ({ item }) => (
        <PlaceCard item={item} onPress={handlePress} styles={cityDetailsStyles} />
    );

    return (
        <View style={cityDetailsStyles.page}>
            <ScrollView style={cityDetailsStyles.container}>
                {/* Header */}
                <View style={cityDetailsStyles.header}>
                    <View style={cityDetailsStyles.headerTop}>
                        <View>
                            <Text style={cityDetailsStyles.headerText}>Chào, {username || 'Guest'}</Text>
                            <Text style={cityDetailsStyles.locationText}>{city}, Việt Nam</Text>
                            <Text style={cityDetailsStyles.dateText}>Ngày: {currentDate}</Text>
                        </View>
                        <View style={cityDetailsStyles.headerActions}>
                            <TouchableOpacity
                                style={cityDetailsStyles.actionButton}
                                onPress={() => navigation.navigate('AIChat', { city })}
                            >
                                <Icon name="smart-toy" size={24} color="#34C759" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={cityDetailsStyles.accountButton}
                                onPress={openAccountModal}
                            >
                                <Icon name="account-circle" size={32} color="#c026d3" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Search Section */}
                <SearchBar 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onSearch={onSearch}
                    styles={cityDetailsStyles}
                />

                {/* Hotels */}
                <Text style={cityDetailsStyles.sectionTitle}>Hotels</Text>
                {hotels.length > 0 ? (
                    <FlatList
                        data={hasSearched ? filteredHotels : hotels}
                        renderItem={renderPlace}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={cityDetailsStyles.flatListContent}
                    />
                ) : (
                    <Text style={cityDetailsStyles.noDataText}>Chưa có hotels.</Text>
                )}

                {/* Homestays */}
                <Text style={cityDetailsStyles.sectionTitle}>Homestays</Text>
                {homestays.length > 0 ? (
                    <FlatList
                        data={hasSearched ? filteredHomestays : homestays}
                        renderItem={renderPlace}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={cityDetailsStyles.flatListContent}
                    />
                ) : (
                    <Text style={cityDetailsStyles.noDataText}>Chưa có homestays.</Text>
                )}
            </ScrollView>

            {/* Account Modal */}
            <Modal
                visible={showAccountModal}
                transparent={true}
                animationType="none"
                onRequestClose={closeAccountModal}
            >
                <View style={cityDetailsStyles.modalOverlay}>
                    <Animated.View style={[
                        cityDetailsStyles.modalContent,
                        {
                            transform: [{
                                translateY: accountModalAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [400, 0],
                                })
                            }]
                        }
                    ]}>
                        <View style={cityDetailsStyles.modalHeader}>
                            <Text style={cityDetailsStyles.modalTitle}>Tài khoản</Text>
                            <TouchableOpacity 
                                style={cityDetailsStyles.modalCloseButton}
                                onPress={closeAccountModal}
                            >
                                <Icon name="close" size={24} color="#6b7280" />
                            </TouchableOpacity>
                        </View>
                        
                        <View style={cityDetailsStyles.modalBody}>
                            <View style={cityDetailsStyles.userInfo}>
                                <Icon name="account-circle" size={48} color="#c026d3" />
                                <Text style={cityDetailsStyles.userName}>{username || 'Guest'}</Text>
                                <Text style={cityDetailsStyles.userLocation}>Hiện tại: {city}</Text>
                            </View>

                            <TouchableOpacity
                                style={cityDetailsStyles.cityPickerButton}
                                onPress={openCityModal}
                            >
                                <Text style={cityDetailsStyles.cityPickerText}>Thay đổi thành phố</Text>
                                <Text style={cityDetailsStyles.cityPickerArrow}>▼</Text>
                            </TouchableOpacity>

                            <View style={cityDetailsStyles.modalActions}>
                                <TouchableOpacity
                                    style={cityDetailsStyles.actionButton}
                                    onPress={() => navigation.navigate('BookingManagementScreen')}
                                >
                                    <Icon name="shopping-cart" size={20} color="#007AFF" />
                                    <Text style={cityDetailsStyles.actionButtonText}>Đơn đặt phòng</Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity
                                    style={[cityDetailsStyles.actionButton, cityDetailsStyles.logoutButton]}
                                    onPress={handleLogout}
                                >
                                    <Icon name="logout" size={20} color="#ef4444" />
                                    <Text style={[cityDetailsStyles.actionButtonText, cityDetailsStyles.logoutText]}>Đăng xuất</Text>
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
                <View style={cityDetailsStyles.modalOverlay}>
                    <Animated.View style={[
                        cityDetailsStyles.modalContent,
                        {
                            transform: [{
                                translateY: cityModalAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [400, 0],
                                })
                            }]
                        }
                    ]}>
                        <View style={cityDetailsStyles.modalHeader}>
                            <Text style={cityDetailsStyles.modalTitle}>Chọn thành phố</Text>
                            <TouchableOpacity 
                                style={cityDetailsStyles.modalCloseButton}
                                onPress={closeCityModal}
                            >
                                <Icon name="close" size={24} color="#6b7280" />
                            </TouchableOpacity>
                        </View>
                        
                        <View style={cityDetailsStyles.modalBody}>
                            {loadingCities ? (
                                <View style={cityDetailsStyles.loadingContainer}>
                                    <ActivityIndicator size="large" color="#c026d3" />
                                    <Text style={cityDetailsStyles.loadingText}>Đang tải danh sách thành phố...</Text>
                                </View>
                            ) : (
                                <ScrollView style={cityDetailsStyles.cityList}>
                                    {availableCities.map((cityName, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[
                                                cityDetailsStyles.cityItem,
                                                city === cityName && cityDetailsStyles.cityItemSelected
                                            ]}
                                            onPress={() => handleCityChange(cityName)}
                                        >
                                            <Text style={[
                                                cityDetailsStyles.cityItemText,
                                                city === cityName && cityDetailsStyles.cityItemTextSelected
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
        </View>
    );
};

export default CityDetailsScreen;
