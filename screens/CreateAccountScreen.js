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
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        setError('');
        setUsernameError('');
        setEmailError('');
        setPasswordError('');

        const trimmedUsername = username.trim();
        const trimmedEmail = email.trim();
        const rawPassword = password;

        let hasError = false;
        if (!trimmedUsername) {
            setUsernameError('Vui lòng nhập tên người dùng.');
            hasError = true;
        }
        if (!trimmedEmail) {
            setEmailError('Vui lòng nhập email.');
            hasError = true;
        }
        if (!rawPassword) {
            setPasswordError('Vui lòng nhập mật khẩu.');
            hasError = true;
        }
        if (hasError) return;

        try {
            setLoading(true);
            const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, rawPassword);
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
                    setEmailError('Email đã được đăng ký.');
                    setError('Email đã được đăng ký. Vui lòng sử dụng email khác.');
                } else if (error.code === 'auth/invalid-email') {
                    setEmailError('Email không hợp lệ.');
                    setError('Vui lòng kiểm tra lại thông tin.');
                } else if (error.code === 'auth/weak-password') {
                    setPasswordError('Mật khẩu phải có ít nhất 6 ký tự.');
                    setError('Mật khẩu chưa đủ mạnh.');
                } else if (error.code === 'auth/operation-not-allowed') {
                    setError('Tài khoản email/password chưa được bật trong Firebase Auth.');
                } else {
                    setError('Có lỗi xảy ra. Vui lòng thử lại.');
                }
                if (__DEV__) {
                    console.log('Sign up error:', error.message);
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
                    <Text style={styles.title}>Tạo tài khoản</Text>
                    <Text style={styles.subtitle}>Bắt đầu hành trình đặt phòng của bạn</Text>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <TextInput style={[styles.input, usernameError && styles.inputError]} placeholder="Username" value={username} onChangeText={(t) => { setUsername(t); if (usernameError) setUsernameError(''); }} placeholderTextColor="#9aa3af" />
                    {usernameError ? <Text style={styles.fieldError}>{usernameError}</Text> : null}
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

                    <TouchableOpacity style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]} onPress={handleSignUp} disabled={loading}>
                        <Text style={styles.primaryBtnText}>{loading ? 'Đang xử lý...' : 'Đăng ký'}</Text>
                    </TouchableOpacity>

                    <Text style={styles.orText}>Hoặc đăng ký với</Text>
                    <View style={styles.socialContainer}>
                        <TouchableOpacity style={styles.socialButton}>
                            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/300/300221.png' }} style={styles.socialIcon} />
                            <Text style={styles.socialText}>Google</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton}>
                            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/145/145802.png' }} style={styles.socialIcon} />
                            <Text style={styles.socialText}>Facebook</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.footerText}>
                        Bạn đã có tài khoản? <Text style={styles.loginLink} onPress={() => navigation.navigate('LoginScreen')}>Đăng nhập</Text>
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
    logo: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
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
    loginLink: { color: '#c026d3', fontWeight: '900' },
});

export default CreateAccountScreen;
