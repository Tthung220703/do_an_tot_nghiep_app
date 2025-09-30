import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { firestore } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const WelcomeScreen = ({ route, navigation }) => {
    const { username } = route.params;
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [loading, setLoading] = useState(true);

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
        <ImageBackground
            source={{
                uri: 'https://files.oaiusercontent.com/file-GnvmH7vPVn89Y7RgcHVuof?se=2024-11-26T14%3A32%3A00Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D08385e95-674b-47f2-bb47-11157d0d1eea.webp&sig=r5cigflssL9bt/nPHg/vxrzK6ZzMLiiZfhjMqwPenik%3D',
            }}
            style={styles.background}
            blurRadius={10} // Hiệu ứng blur
        >
            <View style={styles.container}>
                {/* Header Image */}
                <View style={styles.headerImageContainer}>
                    <Image
                        source={{
                            uri: 'https://files.oaiusercontent.com/file-GnvmH7vPVn89Y7RgcHVuof?se=2024-11-26T14%3A32%3A00Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D08385e95-674b-47f2-bb47-11157d0d1eea.webp&sig=r5cigflssL9bt/nPHg/vxrzK6ZzMLiiZfhjMqwPenik%3D',
                        }}
                        style={styles.headerImage}
                    />
                </View>

                {/* Welcome Text */}
                <Text style={styles.welcomeText}>Xin chào, {username}!</Text>
                <Text style={styles.description}>
                    Chọn thành phố bạn muốn nghỉ dưỡng:
                </Text>

                {/* City Picker */}
                {loading ? (
                    <ActivityIndicator size="large" color="#007AFF" style={styles.loadingIndicator} />
                ) : cities.length > 0 ? (
                    <Picker
                        selectedValue={selectedCity}
                        style={styles.picker}
                        onValueChange={(itemValue) => setSelectedCity(itemValue)}
                    >
                        <Picker.Item label="Lựa chọn thành phố" value="" />
                        {cities.map((city, index) => (
                            <Picker.Item key={index} label={city} value={city} />
                        ))}
                    </Picker>
                ) : (
                    <Text style={styles.loadingText}>Không có thành phố nào</Text>
                )}

                {/* Explore Button */}
                <TouchableOpacity
                    style={[styles.button, !selectedCity && styles.buttonDisabled]}
                    onPress={() => navigation.navigate('CityDetailsScreen', { city: selectedCity })}
                    disabled={!selectedCity}
                >
                    <Text style={styles.buttonText}>
                        Xác nhận {selectedCity || 'Thành phố'}
                    </Text>
                </TouchableOpacity>

            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.7)', 
        borderRadius: 20,
        margin: 10,
    },
    headerImageContainer: {
        width: 150,
        height: 150,
        borderRadius: 75,
        overflow: 'hidden',
        marginBottom: 20,
        borderWidth: 5,
        borderColor: '#fff',
    },
    headerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    picker: {
        height: 50,
        width: '90%',
        maxWidth: 300,
        marginBottom: 20,
        backgroundColor: '#FFF',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#DDD',
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        borderRadius: 10,
        width: '90%',
        maxWidth: 300,
        alignItems: 'center',
        elevation: 3,
    },
    buttonDisabled: {
        backgroundColor: '#B0C4DE',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    loadingIndicator: {
        marginBottom: 20,
    },
});

export default WelcomeScreen;
