import { AppRegistry } from 'react-native';
import App from './pages/App4';
import PushNotification from 'react-native-push-notification';
import { name as appName } from './app.json';

PushNotification.configure({
  onRegister: function (token) {
    console.log("TOKEN:", token);
  },
  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);
  },
  onRegistrationError: function(err) {
    console.error(err.message, err);
  },
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: true, // Android için true kalabilir
});

AppRegistry.registerComponent(appName, () => App);

