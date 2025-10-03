import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Import Firebase auth
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase'; // Import Firestore

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);
    const [remember, setRemember] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    const handleLogin = async () => {
        // Reset field errors
        setEmailError('');
        setPasswordError('');
        setError('');

        const trimmedEmail = email.trim();
        const trimmedPassword = password;

        // Simple client-side validation
        let hasError = false;
        if (!trimmedEmail) {
            setEmailError('Vui lòng nhập email.');
            hasError = true;
        }
        if (!trimmedPassword) {
            setPasswordError('Vui lòng nhập mật khẩu.');
            hasError = true;
        }
        if (hasError) return;

        try {
            setLoading(true);
            // Đăng nhập người dùng
            const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
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
                setEmailError('Không tìm thấy người dùng với email này.');
                setError('Thông tin đăng nhập không hợp lệ.');
            } else if (error.code === 'auth/wrong-password') {
                setPasswordError('Mật khẩu không đúng.');
                setError('Thông tin đăng nhập không hợp lệ.');
            } else if (error.code === 'auth/invalid-login-credentials') {
                setError('Email hoặc mật khẩu không đúng.');
            } else if (error.code === 'auth/invalid-email') {
                setEmailError('Email không hợp lệ.');
                setError('Vui lòng kiểm tra lại thông tin.');
            } else if (error.code === 'auth/too-many-requests') {
                setError('Bạn đã thử quá nhiều lần. Vui lòng thử lại sau.');
            } else {
                setError('Có lỗi xảy ra. Vui lòng thử lại.'); // Thông báo lỗi chung bằng tiếng Việt
            }
            if (__DEV__) {
                console.log('Login error:', error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.page}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <View style={styles.card}>
                    <View style={styles.topIcon}><Text style={styles.topIconGlyph}>▤</Text></View>
                    <Text style={styles.title}>Đăng nhập</Text>
                    <Text style={styles.subtitle}>Chào mừng bạn quay trở lại</Text>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <TextInput
                        style={[styles.input, emailError && styles.inputError]}
                        placeholder="Email"
                        value={email}
                        onChangeText={(t) => { setEmail(t); if (emailError) setEmailError(''); }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor="#9aa3af"
                    />
                    {emailError ? <Text style={styles.fieldError}>{emailError}</Text> : null}
                    <TextInput
                        style={[styles.input, passwordError && styles.inputError]}
                        placeholder="Password"
                        value={password}
                        onChangeText={(t) => { setPassword(t); if (passwordError) setPasswordError(''); }}
                        secureTextEntry
                        autoCapitalize="none"
                        placeholderTextColor="#9aa3af"
                    />
                    {passwordError ? <Text style={styles.fieldError}>{passwordError}</Text> : null}

                    <TouchableOpacity style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]} onPress={handleLogin} disabled={loading}>
                        <Text style={styles.primaryBtnText}>{loading ? 'Đang xử lý...' : 'Đăng nhập'}</Text>
                    </TouchableOpacity>

                    <Text style={styles.orText}>Hoặc đăng nhập với</Text>
                    <View style={styles.socialContainer}>
                        <TouchableOpacity style={styles.socialButton} onPress={() => Alert.alert('Thông báo', 'Tính năng đăng nhập Google chưa hoạt động!')}>
                            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/300/300221.png' }} style={styles.socialIcon} />
                            <Text style={styles.socialText}>Google</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton} onPress={() => Alert.alert('Thông báo', 'Tính năng đăng nhập Facebook chưa hoạt động!')}>
                            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/145/145802.png' }} style={styles.socialIcon} />
                            <Text style={styles.socialText}>Facebook</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.footerText}>
                        Bạn chưa có tài khoản? <Text style={styles.signUpLink} onPress={() => navigation.navigate('CreateAccountScreen')}>Đăng ký</Text>
                    </Text>
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
    errorText: { color: '#dc2626', fontSize: 14, marginBottom: 10, textAlign: 'center' },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        fontSize: 15,
        backgroundColor: '#ffffff',
        color: '#0f172a',
    },
    primaryBtn: { width: '100%', alignItems: 'center', marginTop: 4, marginBottom: 8 },
    primaryBtnDisabled: { opacity: 0.7 },
    primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '900', backgroundColor: '#c026d3', paddingVertical: 14, width: '100%', textAlign: 'center', borderRadius: 14 },
    inputError: { borderColor: '#ef4444' },
    fieldError: { width: '100%', color: '#ef4444', fontSize: 12, marginTop: -6, marginBottom: 8 },
    orText: { fontSize: 14, color: '#9ca3af', marginBottom: 10, textAlign: 'center' },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        padding: 12,
        width: '45%',
        justifyContent: 'center',
    },
    socialIcon: { width: 20, height: 20, marginRight: 10 },
    socialText: { fontSize: 15, color: '#0f172a' },
    footerText: { fontSize: 14, color: '#6b7280', textAlign: 'center' },
    signUpLink: { color: '#c026d3', fontWeight: '900' },
});

export default LoginScreen;
