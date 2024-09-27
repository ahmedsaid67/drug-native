import { AppRegistry } from 'react-native';
import App from './pages/App4';
import PushNotification from 'react-native-push-notification';
import App3 from './App3'
import { name as appName } from './app.json';
import notifee, { EventType } from '@notifee/react-native';

notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.DELIVERED) {
    console.log('Notification delivered in background:', detail.notification);
    // arka planda iken uygulama bildirim atıldıgında burası dınleyebılıyor buradan gereklı ıslemler yapılabılır.
  }
});

AppRegistry.registerComponent(appName, () => App);

