import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';

// Import các file đã tách
import { createAccountScreenStyles } from '../styles/CreateAccountScreenStyles';
import SignUpForm from '../components/SignUpForm';
import { validateSignUpForm, handleSignUp, getAuthErrorMessage } from '../utils/authUtils';

const CreateAccountScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);

    const onSignUp = async () => {
        setError('');
        setUsernameError('');
        setEmailError('');
        setPasswordError('');

        // Validate form
        const validationErrors = validateSignUpForm(username, email, password);
        if (Object.keys(validationErrors).length > 0) {
            if (validationErrors.username) setUsernameError(validationErrors.username);
            if (validationErrors.email) setEmailError(validationErrors.email);
            if (validationErrors.password) setPasswordError(validationErrors.password);
            return;
        }

        try {
            setLoading(true);
            const result = await handleSignUp(username, email, password);
            
            if (result.success) {
                navigation.navigate('LoginScreen');
            } else {
                const errorMessages = getAuthErrorMessage(result.error);
                if (errorMessages.username) setUsernameError(errorMessages.username);
                if (errorMessages.email) setEmailError(errorMessages.email);
                if (errorMessages.password) setPasswordError(errorMessages.password);
                if (errorMessages.general) setError(errorMessages.general);
                
                if (__DEV__) {
                    console.log('Sign up error:', result.error.message);
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

    const onNavigateToLogin = () => {
        navigation.navigate('LoginScreen');
    };

    return (
        <View style={createAccountScreenStyles.page}>
            <ScrollView contentContainerStyle={createAccountScreenStyles.container} keyboardShouldPersistTaps="handled">
                <SignUpForm
                    username={username}
                    setUsername={setUsername}
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    usernameError={usernameError}
                    setUsernameError={setUsernameError}
                    emailError={emailError}
                    setEmailError={setEmailError}
                    passwordError={passwordError}
                    setPasswordError={setPasswordError}
                    error={error}
                    loading={loading}
                    onSignUp={onSignUp}
                    onNavigateToLogin={onNavigateToLogin}
                    styles={createAccountScreenStyles}
                />
            </ScrollView>
        </View>
    );
};

export default CreateAccountScreen;
