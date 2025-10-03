import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, ScrollView, Modal, FlatList } from 'react-native';
import { firestore } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const WelcomeScreen = ({ route, navigation }) => {
    const { username } = route.params;
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [loading, setLoading] = useState(true);
    const [showCityModal, setShowCityModal] = useState(false);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const querySnapshot = await getDocs(collection(firestore, 'hotels'));
                const cityList = [];
                querySnapshot.forEach((doc) => {
                    const city = doc.data().city;
                    if (city && !cityList.includes(city)) {
                        cityList.push(city);
                    }
                });
                setCities(cityList);
            } catch (error) {
                console.error('Error fetching cities:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCities();
    }, []);

    return (
        <View style={styles.page}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <View style={styles.card}>
                    <View style={styles.topIcon}><Text style={styles.topIconGlyph}>🏨</Text></View>
                    <Text style={styles.title}>Xin chào, {username}!</Text>
                    <Text style={styles.subtitle}>Chọn thành phố bạn muốn nghỉ dưỡng</Text>

                    {/* City Picker */}
                    {loading ? (
                        <ActivityIndicator size="large" color="#c026d3" style={styles.loadingIndicator} />
                    ) : cities.length > 0 ? (
                        <TouchableOpacity 
                            style={styles.pickerWrapper}
                            onPress={() => setShowCityModal(true)}
                        >
                            <Text style={[styles.pickerText, !selectedCity && styles.pickerPlaceholder]}>
                                {selectedCity || 'Lựa chọn thành phố'}
                            </Text>
                            <Text style={styles.pickerArrow}>▼</Text>
                        </TouchableOpacity>
                    ) : (
                        <Text style={styles.loadingText}>Không có thành phố nào</Text>
                    )}

                    {/* City Selection Modal */}
                    <Modal
                        visible={showCityModal}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={() => setShowCityModal(false)}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>Chọn thành phố</Text>
                                    <TouchableOpacity 
                                        style={styles.modalCloseButton}
                                        onPress={() => setShowCityModal(false)}
                                    >
                                        <Text style={styles.modalCloseText}>✕</Text>
                                    </TouchableOpacity>
                                </View>
                                <FlatList
                                    data={cities}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={[
                                                styles.cityItem,
                                                selectedCity === item && styles.cityItemSelected
                                            ]}
                                            onPress={() => {
                                                setSelectedCity(item);
                                                setShowCityModal(false);
                                            }}
                                        >
                                            <Text style={[
                                                styles.cityItemText,
                                                selectedCity === item && styles.cityItemTextSelected
                                            ]}>
                                                {item}
                                            </Text>
                                            {selectedCity === item && (
                                                <Text style={styles.checkmark}>✓</Text>
                                            )}
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        </View>
                    </Modal>

                    {/* Explore Button */}
                    <TouchableOpacity
                        style={[styles.primaryBtn, !selectedCity && styles.primaryBtnDisabled]}
                        onPress={() => navigation.navigate('CityDetailsScreen', { city: selectedCity })}
                        disabled={!selectedCity}
                    >
                        <Text style={styles.primaryBtnText}>Xác nhận {selectedCity || 'Thành phố'}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    page: { flex: 1, backgroundColor: '#f6f7fb' },
    container: { flexGrow: 1, padding: 20, justifyContent: 'center' },
    card: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 24,
        padding: 24,
        marginHorizontal: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 8 },
    },
    topIcon: { width: 72, height: 72, borderRadius: 18, backgroundColor: '#c026d3', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    topIconGlyph: { color: '#fff', fontSize: 28, fontWeight: '800' },
    title: { fontSize: 28, fontWeight: '900', color: '#0f172a', marginBottom: 6, textAlign: 'center' },
    subtitle: { fontSize: 15, color: '#64748b', marginBottom: 16, textAlign: 'center' },
    pickerWrapper: {
        height: 50,
        width: '90%',
        maxWidth: 300,
        marginBottom: 20,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 14,
    },
    pickerText: {
        fontSize: 16,
        color: '#0f172a',
        flex: 1,
    },
    pickerPlaceholder: {
        color: '#9aa3af',
    },
    pickerArrow: {
        fontSize: 12,
        color: '#9aa3af',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '70%',
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
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a',
    },
    modalCloseButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCloseText: {
        fontSize: 16,
        color: '#6b7280',
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
    checkmark: {
        fontSize: 16,
        color: '#c026d3',
        fontWeight: 'bold',
    },
    primaryBtn: { width: '90%', maxWidth: 300, alignItems: 'center', marginTop: 4, marginBottom: 8 },
    primaryBtnDisabled: { opacity: 0.6 },
    primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '900', backgroundColor: '#c026d3', paddingVertical: 14, width: '100%', textAlign: 'center', borderRadius: 14 },
    loadingText: { fontSize: 16, color: '#64748b', marginBottom: 16, textAlign: 'center' },
    loadingIndicator: { marginBottom: 16 },
});

export default WelcomeScreen;
