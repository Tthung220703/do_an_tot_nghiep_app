import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import CreateAccountScreen from './screens/CreateAccountScreen';
import LoginScreen from './screens/LoginScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import CityDetailsScreen from './screens/CityDetailsScreen';
import OrderScreen from './screens/OrderScreen';
import PaymentScreen from './screens/PaymentScreen';
import BookingManagementScreen from './screens/BookingManagementScreen';
import AIChatScreen from './screens/AIChatScreen';
import { DarkTheme } from './theme';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer theme={{ colors: { background: DarkTheme.colors.background } }}>
      <Stack.Navigator
        initialRouteName="LoginScreen"
        screenOptions={{
          headerStyle: { backgroundColor: DarkTheme.colors.surface },
          headerTintColor: DarkTheme.colors.textPrimary,
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: '800' },
          animationEnabled: true,
          gestureEnabled: true,
          animationTypeForReplace: 'push',
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
        <Stack.Screen
          name="WelcomeScreen"
          component={WelcomeScreen}
          options={{
            headerShown: false,
            cardStyleInterpolator: ({ current }) => ({
              cardStyle: { opacity: current.progress },
            }),
          }}
        />
        <Stack.Screen
          name="CreateAccountScreen"
          component={CreateAccountScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="CityDetailsScreen" component={CityDetailsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Order" component={OrderScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Payment" component={PaymentScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="BookingManagementScreen"
          component={BookingManagementScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AIChat"
          component={AIChatScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
