import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';

// Import các file đã tách
import { loginScreenStyles } from '../styles/LoginScreenStyles';
import LoginForm from '../components/LoginForm';
import { validateLoginForm, handleLogin, getAuthErrorMessage } from '../utils/authUtils';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);

    const onLogin = async () => {
        // Reset field errors
        setEmailError('');
        setPasswordError('');
        setError('');

        // Validate form
        const validationErrors = validateLoginForm(email, password);
        if (Object.keys(validationErrors).length > 0) {
            if (validationErrors.email) setEmailError(validationErrors.email);
            if (validationErrors.password) setPasswordError(validationErrors.password);
            return;
        }

        try {
            setLoading(true);
            const result = await handleLogin(email, password);
            
            if (result.success) {
                console.log('Navigating to WelcomeScreen with username:', result.username);
                navigation.navigate('WelcomeScreen', { username: result.username });
            } else {
                const errorMessages = getAuthErrorMessage(result.error);
                if (errorMessages.email) setEmailError(errorMessages.email);
                if (errorMessages.password) setPasswordError(errorMessages.password);
                if (errorMessages.general) setError(errorMessages.general);
                
                if (__DEV__) {
                    console.log('Login error:', result.error.message);
                }
            }
        } catch (error) {
            setError('Có lỗi xảy ra. Vui lòng thử lại.');
            if (__DEV__) {
                console.log('Unexpected error:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    const onNavigateToSignUp = () => {
        navigation.navigate('CreateAccountScreen');
    };

    return (
        <View style={loginScreenStyles.page}>
            <ScrollView contentContainerStyle={loginScreenStyles.container} keyboardShouldPersistTaps="handled">
                <LoginForm
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    emailError={emailError}
                    setEmailError={setEmailError}
                    passwordError={passwordError}
                    setPasswordError={setPasswordError}
                    error={error}
                    loading={loading}
                    onLogin={onLogin}
                    onNavigateToSignUp={onNavigateToSignUp}
                    styles={loginScreenStyles}
                />
            </ScrollView>
        </View>
    );
};

export default LoginScreen;
