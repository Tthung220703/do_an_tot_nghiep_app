import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '../firebase';

const CreateAccountScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignUp = async () => {
        if (username && email && password) {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                if (user) {
                    const userDocRef = doc(firestore, 'users', user.uid);

                    await setDoc(userDocRef, {
                        username: username,
                        email: email,
                        createdAt: new Date(),
                    });
                }

                navigation.navigate('LoginScreen');
            } catch (error) {
                if (error.code === 'auth/email-already-in-use') {
                    setError('Email đã được đăng ký. Vui lòng sử dụng email khác.');
                } else {
                    setError(error.message);
                }
            }
        } else {
            setError('Vui lòng điền tất cả các trường.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Logo */}
            <Image
                source={{ uri: 'https://files.oaiusercontent.com/file-GnvmH7vPVn89Y7RgcHVuof?se=2024-11-26T14%3A32%3A00Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D08385e95-674b-47f2-bb47-11157d0d1eea.webp&sig=r5cigflssL9bt/nPHg/vxrzK6ZzMLiiZfhjMqwPenik%3D' }} 
                style={styles.logo}
            />

            {/* Tiêu đề */}
            <Text style={styles.title}>Đăng ký</Text>
            <Text style={styles.subtitle}>Bắt đầu tạo tài khoản của bạn</Text>

            {/* Hiển thị lỗi */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Nhập tên người dùng */}
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                placeholderTextColor="#aaa"
            />

            {/* Nhập email */}
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#aaa"
            />

            {/* Nhập mật khẩu */}
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                placeholderTextColor="#aaa"
            />

            {/* Nút đăng ký */}
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Đăng ký</Text>
            </TouchableOpacity>

            {/* Divider */}
            <Text style={styles.orText}>Hoặc đăng ký với</Text>

            {/* Đăng ký qua mạng xã hội */}
            <View style={styles.socialContainer}>
                <TouchableOpacity style={styles.socialButton}>
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/300/300221.png' }} // Icon Google
                        style={styles.socialIcon}
                    />
                    <Text style={styles.socialText}>Google</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/145/145802.png' }} // Icon Facebook
                        style={styles.socialIcon}
                    />
                    <Text style={styles.socialText}>Facebook</Text>
                </TouchableOpacity>
            </View>

            {/* Chuyển đến màn hình đăng nhập */}
            <Text style={styles.footerText}>
                Bạn đã có tài khoản?{' '}
                <Text style={styles.loginLink} onPress={() => navigation.navigate('LoginScreen')}>
                    Đăng nhập
                </Text>
            </Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    button: {
        width: '100%',
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    orText: {
        fontSize: 16,
        color: '#888',
        marginBottom: 10,
        textAlign: 'center',
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 10,
        width: '45%',
        justifyContent: 'center',
    },
    socialIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    socialText: {
        fontSize: 16,
        color: '#333',
    },
    footerText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
    },
    loginLink: {
        color: '#007AFF',
        fontWeight: 'bold',
    },
});

export default CreateAccountScreen;
