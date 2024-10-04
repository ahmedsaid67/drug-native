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
import { useEffect } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../utils/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import notifee, { EventType } from '@notifee/react-native';



const Stack = createNativeStackNavigator();

const Router = ({ currentRoute }) => {

  const loginStatus = useSelector((state) => state.login.success);
  const userMail = useSelector((state) => state.user.email);


  // Geçmiş bildirimleri kontrol eden fonksiyon
  const checkNotificationsOnAppStart = async () => {
    try {
      const notificationsString = await AsyncStorage.getItem('notifications');
  
      if (notificationsString) {
        const notificationsList = JSON.parse(notificationsString);
        const currentTime = new Date().getTime(); // Şu anki zaman
  
        // Geçmişteki bildirimleri filtrele
        const pastNotifications = notificationsList.filter(notification => {
          const notificationTime = new Date(notification.tarih + ' ' + notification.saat).getTime(); // Tarih ve saat bilgisini birleştir
  
          // Geçmişteki ve kullanıcıya ait bildirimler
          return notificationTime < currentTime && notification.email === userMail;
        });
  
        console.log("pastNotifications:", pastNotifications);
  
        if (pastNotifications.length > 0) {
          // API'ye gönder
          await axios.post(API_ROUTES.NOTIFICATIONS_CREATE, { bildirim_list: pastNotifications });
  
          // Gönderilen bildirimleri yerel depolamadan sil
          const updatedNotificationsList = notificationsList.filter(notification =>
            !pastNotifications.some(pastNotification => pastNotification.id === notification.id)
          );
          await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotificationsList));
          console.log("Past notifications sent and removed from storage.");
        }
      }
    } catch (error) {
      console.error('Error checking notifications on app start:', error);
    }
  };

  useEffect(() => {
    if(loginStatus){
      checkNotificationsOnAppStart();
    } 
  }, []);



  useEffect(() => {
    // Eğer userMail yoksa dinleyicileri ekleme ve return ile çık
    if (!userMail) return;

    // Dinleyiciler tanımlandığında unsubscribe fonksiyonlarını tutacağız
    let unsubscribeBackground = null;
    let unsubscribeForeground = null;

    // Arka plan bildirim dinleyici
    unsubscribeBackground = notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === EventType.DELIVERED) {
        try {
          const { data } = detail.notification;

          // Gelen bildirimi userMail ile karşılaştır
          if (data.email === userMail) {
            console.log('Bildirim arka planda alındı:', data);

            const explanations = data.explanations;
            const hatirlatici_id = data.hatirlatici_id;
            const saat = data.saat;
            const tarih = data.tarih;
            const notificationId = data.notificationId;

            const notificationsList = [{ explanations, hatirlatici_id, saat, tarih }];

            // Bildirimi API'ya kaydet
            await axios.post(API_ROUTES.NOTIFICATIONS_CREATE, {
              bildirim_list: notificationsList
            });

            // AsyncStorage'den bildirimi sil
            await removeNotificationFromStorage(notificationId);
          }

        } catch (error) {
          console.error('Error handling background notification:', error);
        }
      }
    });

    // Ön plan bildirim dinleyici
    unsubscribeForeground = notifee.onForegroundEvent(async ({ type, detail }) => {
      if (type === EventType.DELIVERED) {
        try {
          const { data } = detail.notification;
          // Gelen bildirimi userMail ile karşılaştır
          if (data.email === userMail) {
            console.log('Bildirim ön planda alındı:', data);
            

            const explanations = data.explanations;
            const hatirlatici_id = data.hatirlatici_id;
            const saat = data.saat;
            const tarih = data.tarih;
            const notificationId = data.notificationId;

            const notificationsList = [{ explanations, hatirlatici_id, saat, tarih }];

            // Bildirimi API'ya kaydet
            await axios.post(API_ROUTES.NOTIFICATIONS_CREATE, {
              bildirim_list: notificationsList
            });

            // AsyncStorage'den bildirimi sil
            await removeNotificationFromStorage(notificationId);
          }

        } catch (error) {
          console.error('Error handling foreground notification:', error);
        }
      }
    });

    // Component unmount olduğunda dinleyiciyi kaldır
    return () => {
      if (unsubscribeBackground) unsubscribeBackground();
      if (unsubscribeForeground) unsubscribeForeground();
    };
  }, [userMail]); // Bağımlılık dizisine userMail eklenir, userMail değiştiğinde dinleyiciler tekrar eklenir

  // AsyncStorage'den bildirimi silen fonksiyon
  const removeNotificationFromStorage = async (notificationId) => {
    try {
      // Mevcut bildirimleri al
      const existingNotificationsString = await AsyncStorage.getItem('notifications');
      if (!existingNotificationsString) return;

      // Bildirim listesini parse et
      let notificationsList = JSON.parse(existingNotificationsString);

      // NotificationId'ye göre bildirimi bul ve listeden çıkar
      notificationsList = notificationsList.filter(notification => notification.id !== notificationId);

      // Güncellenmiş listeyi tekrar AsyncStorage'e kaydet
      await AsyncStorage.setItem('notifications', JSON.stringify(notificationsList));
      console.log(`Notification with ID ${notificationId} deleted from storage.`);
    } catch (error) {
      console.error('Error removing notification from storage:', error);
    }
  };

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



