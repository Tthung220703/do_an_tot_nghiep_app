import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Import Firebase auth
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase'; // Import Firestore

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            // Đăng nhập người dùng
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Kiểm tra nếu đăng nhập thành công
            if (!user) {
                console.error('User is undefined');
                return;
            }

            // Lấy thông tin người dùng từ Firestore
            const docRef = doc(firestore, 'users', user.uid);
            const docSnap = await getDoc(docRef);

            // Kiểm tra tài liệu có tồn tại không
            if (docSnap.exists()) {
                const userData = docSnap.data();
                console.log('Navigating to WelcomeScreen with username:', userData.username);
                navigation.navigate('WelcomeScreen', { username: userData.username }); // Truyền username đến WelcomeScreen
            } else {
                console.log('No such document!'); // Nếu không tìm thấy tài liệu
                setError('User data not found.');
            }
        } catch (error) {
            // Xử lý lỗi khi đăng nhập thất bại
            if (error.code === 'auth/user-not-found') {
                setError('No user found with this email.');
            } else if (error.code === 'auth/wrong-password') {
                setError('Incorrect password.');
            } else {
                setError(error.message); // Hiển thị lỗi chung nếu có
            }
            console.error('Login error:', error.message); // In ra lỗi để kiểm tra
        }
    };

    return (
        <View style={styles.container}>
            {/* Logo */}
            <Image
                source={{ uri: 'https://files.oaiusercontent.com/file-GnvmH7vPVn89Y7RgcHVuof?se=2024-11-26T14%3A32%3A00Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D08385e95-674b-47f2-bb47-11157d0d1eea.webp&sig=r5cigflssL9bt/nPHg/vxrzK6ZzMLiiZfhjMqwPenik%3D' }} 
                style={styles.logo}
            />

            {/* Tiêu đề */}
            <Text style={styles.title}>Chào mừng trở lại!</Text>
            <Text style={styles.subtitle}>Vui lòng đăng nhập tài khoản của bạn</Text>

            {/* Thông báo lỗi */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Email Input */}
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#aaa"
            />

            {/* Password Input */}
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                placeholderTextColor="#aaa"
            />

            {/* Nút Login */}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Đăng nhập</Text>
            </TouchableOpacity>

            {/* Footer */}
            <Text style={styles.footerText}>
                Bạn chưa có tài khoản?
                <Text style={styles.registerLink} onPress={() => navigation.navigate('CreateAccountScreen')}>
                    {' '}
                    Đăng ký
                </Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
        borderRadius: 50,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 10,
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
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footerText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#888',
        marginTop: 20,
    },
    registerLink: {
        color: '#007AFF',
        fontWeight: 'bold',
    },
});

export default LoginScreen;
