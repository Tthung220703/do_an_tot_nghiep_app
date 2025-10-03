import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Alert } from 'react-native';

const LoginForm = ({ 
    email, 
    setEmail, 
    password, 
    setPassword, 
    emailError, 
    setEmailError, 
    passwordError, 
    setPasswordError, 
    error, 
    loading, 
    onLogin, 
    onNavigateToSignUp,
    styles 
}) => {
    return (
        <View style={styles.card}>
            <View style={styles.topIcon}>
                <Text style={styles.topIconGlyph}>▤</Text>
            </View>
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

            <TouchableOpacity 
                style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]} 
                onPress={onLogin} 
                disabled={loading}
            >
                <Text style={styles.primaryBtnText}>
                    {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                </Text>
            </TouchableOpacity>

            <Text style={styles.orText}>Hoặc đăng nhập với</Text>
            <View style={styles.socialContainer}>
                <TouchableOpacity 
                    style={styles.socialButton} 
                    onPress={() => Alert.alert('Thông báo', 'Tính năng đăng nhập Google chưa hoạt động!')}
                >
                    <Image 
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/300/300221.png' }} 
                        style={styles.socialIcon} 
                    />
                    <Text style={styles.socialText}>Google</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.socialButton} 
                    onPress={() => Alert.alert('Thông báo', 'Tính năng đăng nhập Facebook chưa hoạt động!')}
                >
                    <Image 
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/145/145802.png' }} 
                        style={styles.socialIcon} 
                    />
                    <Text style={styles.socialText}>Facebook</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.footerText}>
                Bạn chưa có tài khoản? 
                <Text style={styles.signUpLink} onPress={onNavigateToSignUp}>Đăng ký</Text>
            </Text>
        </View>
    );
};

export default LoginForm;
