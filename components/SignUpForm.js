import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';

const SignUpForm = ({ 
    username, 
    setUsername, 
    email, 
    setEmail, 
    password, 
    setPassword, 
    usernameError, 
    setUsernameError, 
    emailError, 
    setEmailError, 
    passwordError, 
    setPasswordError, 
    error, 
    loading, 
    onSignUp, 
    onNavigateToLogin,
    styles 
}) => {
    return (
        <View style={styles.card}>
            <View style={styles.topIcon}>
                <Text style={styles.topIconGlyph}>▤</Text>
            </View>
            <Text style={styles.title}>Tạo tài khoản</Text>
            <Text style={styles.subtitle}>Bắt đầu hành trình đặt phòng của bạn</Text>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TextInput 
                style={[styles.input, usernameError && styles.inputError]} 
                placeholder="Username" 
                value={username} 
                onChangeText={(t) => { setUsername(t); if (usernameError) setUsernameError(''); }} 
                placeholderTextColor="#9aa3af" 
            />
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

            <TouchableOpacity 
                style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]} 
                onPress={onSignUp} 
                disabled={loading}
            >
                <Text style={styles.primaryBtnText}>
                    {loading ? 'Đang xử lý...' : 'Đăng ký'}
                </Text>
            </TouchableOpacity>

            <Text style={styles.orText}>Hoặc đăng ký với</Text>
            <View style={styles.socialContainer}>
                <TouchableOpacity style={styles.socialButton}>
                    <Image 
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/300/300221.png' }} 
                        style={styles.socialIcon} 
                    />
                    <Text style={styles.socialText}>Google</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                    <Image 
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/145/145802.png' }} 
                        style={styles.socialIcon} 
                    />
                    <Text style={styles.socialText}>Facebook</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.footerText}>
                Bạn đã có tài khoản? 
                <Text style={styles.loginLink} onPress={onNavigateToLogin}>Đăng nhập</Text>
            </Text>
        </View>
    );
};

export default SignUpForm;
