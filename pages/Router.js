import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AnaSayfa from './AnaSayfa';
import Arama from './Arama';
import Bildirimler from './Bildirimler';
import Hatirlaticilar from './Hatirlaticilar';
import Login from './Login';
import Register from './Register';
import Layout from '../components/Layout';
import Profil from './Profil'
import ResetPasswordCode from './ResetPasswordCode';
import ResetPassword from './ResetPassword';
import ReminderSearch from './ReminderSearch.js'
import ReminderCreate from './ReminderCreate.js'


const Stack = createNativeStackNavigator();

const Router = ({ currentRoute }) => {
  return (
    <Layout currentRoute={currentRoute}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        
        <Stack.Screen name="Ana Sayfa" component={AnaSayfa} />
        <Stack.Screen name="Arama" component={Arama} />
        <Stack.Screen name="Bildirimler" component={Bildirimler} />
        <Stack.Screen name="Hatırlatıcılar" component={Hatirlaticilar} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Profil" component={Profil} />
        <Stack.Screen name="ResetPasswordCode" component={ResetPasswordCode} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="ReminderSearch" component={ReminderSearch} />
        <Stack.Screen name="ReminderCreate" component={ReminderCreate} />
      </Stack.Navigator>
    </Layout>
  );
};

export default Router;



