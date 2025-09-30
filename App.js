import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CreateAccountScreen from './screens/CreateAccountScreen';
import LoginScreen from './screens/LoginScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import CityDetailsScreen from './screens/CityDetailsScreen';
import OrderScreen from './screens/OrderScreen';
import PaymentScreen from './screens/PaymentScreen';
import BookingManagementScreen from './screens/BookingManagementScreen';
import AIChatScreen from './screens/AIChatScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen
          name="WelcomeScreen"
          component={WelcomeScreen}
          options={{ title: 'Xin chào' }}
        />
        <Stack.Screen
          name="CreateAccountScreen"
          component={CreateAccountScreen}
          options={{ title: 'Đăng ký' }}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ title: 'Đăng nhập' }}
        />
        <Stack.Screen name="CityDetailsScreen" component={CityDetailsScreen} options={{
          title: 'Chi tiết'
        }} />
        <Stack.Screen name="Order" component={OrderScreen} options={{ title: 'Thông tin phòng đặt' }} />
        <Stack.Screen name="Payment" component={PaymentScreen} options={{ title: 'Thanh toán' }} />
        <Stack.Screen
          name="BookingManagementScreen"
          component={BookingManagementScreen}
          options={{ title: 'Quản lý phòng đã đặt' }}
        />
        <Stack.Screen
          name="AIChat"
          component={AIChatScreen}
          options={{ title: 'AI Assistant' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
