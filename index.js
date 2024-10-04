import { AppRegistry } from 'react-native';
import App from './pages/App4';
import { name as appName } from './app.json';
import notifee, { EventType } from '@notifee/react-native';
import axios from 'axios';
import { API_ROUTES } from './utils/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';



// notifee.onBackgroundEvent(async ({ type, detail }) => {
//   if (type === EventType.DELIVERED) {
//     try {
//       const { data } = detail.notification;
//       console.log('Bildirim arka planda alındı:', data);

//       const explanations = data.explanations;
//       const hatirlatici_id = data.hatirlatici_id;
//       const saat = data.saat;
//       const tarih = data.tarih;
//       const notificationId = data.notificationId;  // Bildirimin notificationId'sini alalım

//       const notificationsList = [{ explanations, hatirlatici_id, saat, tarih }];

//       // Bildirimi API'ya kaydet
//       const response = await axios.post(API_ROUTES.NOTIFICATIONS_CREATE, {
//         bildirim_list: notificationsList
//       });

//       // AsyncStorage'den bildirimi sil
//       await removeNotificationFromStorage(notificationId);

//     } catch (error) {
//       console.error('Error handling background notification:', error);
//     }
//   }
// });

// // Ön planda iken gelen bildirimleri dinleme
// notifee.onForegroundEvent(async ({ type, detail }) => {
//   if (type === EventType.DELIVERED) {
//     try {
//       const { data } = detail.notification;
//       console.log('Bildirim ön planda alındı:', data);

//       const explanations = data.explanations;
//       const hatirlatici_id = data.hatirlatici_id;
//       const saat = data.saat;
//       const tarih = data.tarih;
//       const notificationId = data.notificationId;  // Bildirimin notificationId'sini alalım

//       const notificationsList = [{ explanations, hatirlatici_id, saat, tarih }];

//       // Bildirimi API'ya kaydet
//       const response = await axios.post(API_ROUTES.NOTIFICATIONS_CREATE, {
//         bildirim_list: notificationsList
//       });


//       // AsyncStorage'den bildirimi sil
//       await removeNotificationFromStorage(notificationId);

//     } catch (error) {
//       console.error('Error handling foreground notification:', error);
//     }
//   }
// });

// // AsyncStorage'den bildirimi silen fonksiyon
// const removeNotificationFromStorage = async (notificationId) => {
//   try {
//     // Mevcut bildirimleri al
//     const existingNotificationsString = await AsyncStorage.getItem('notifications');
//     if (!existingNotificationsString) return;

//     // Bildirim listesini parse et
//     let notificationsList = JSON.parse(existingNotificationsString);

//     // NotificationId'ye göre bildirimi bul ve listeden çıkar
//     notificationsList = notificationsList.filter(notification => notification.id !== notificationId);

//     // Güncellenmiş listeyi tekrar AsyncStorage'e kaydet
//     await AsyncStorage.setItem('notifications', JSON.stringify(notificationsList));
//     console.log(`Notification with ID ${notificationId} deleted from storage.`);
//   } catch (error) {
//     console.error('Error removing notification from storage:', error);
//   }
// };

AppRegistry.registerComponent(appName, () => App);

