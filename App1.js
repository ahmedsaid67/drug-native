import React, { useEffect } from 'react';
import { SafeAreaView, Button, View, Alert, Platform } from 'react-native';
import notifee, { AndroidImportance, TimestampTrigger, TriggerType } from '@notifee/react-native';
import { PermissionsAndroid } from 'react-native';

const App = () => {
  useEffect(() => {
    const initializeNotificationChannel = async () => {
      try {
        // Önce mevcut kanalları kontrol edin
        const channels = await notifee.getChannels();
        const channelExists = channels.some(channel => channel.id === 'reminder');
  
        if (!channelExists) {
          // Eğer kanal yoksa, yeni bir kanal oluşturun
          await notifee.createChannel({
            id: 'reminder',
            name: 'Reminder Channel',
            importance: AndroidImportance.HIGH,
          });
          console.log('Notification channel created');
        } else {
          console.log('Notification channel already exists, no need to create');
        }
      } catch (error) {
        console.error('Error checking or creating notification channel:', error);
      }
    };
  
    initializeNotificationChannel();
  }, []);
  

  const requestNotificationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Bildirim İzni',
            message: 'Bu uygulamanın bildirim göndermesine izin verin.',
            buttonNeutral: 'Sonra Sor',
            buttonNegative: 'İptal',
            buttonPositive: 'Tamam',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Error requesting permission:', err);
        return false;
      }
    }
    return true; // iOS'da izinleri otomatik olarak alır
  };

  const scheduleNotifications = async () => {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      Alert.alert('İzin Verilmedi', 'Bildirim göndermek için izin vermeniz gerekiyor.');
      return;
    }

    const startTime = new Date();
    startTime.setMinutes(startTime.getMinutes() + 1); // Başlangıç zamanı: şu anki zamanın 1 dakika sonrası

    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + 30); // Bitiş zamanı: 30 dakika sonrası

    const interval = 30 * 1000; // 30 saniye (milisaniye cinsinden)

    let currentTime = startTime;

    while (currentTime <= endTime) {
      try {
        await notifee.createTriggerNotification(
          {
            title: 'Hatırlatıcı Bildirim',
            body: 'Bu bir hatırlatıcı bildirimidir!',
            android: {
              channelId: 'reminder',
            },
          },
          {
            type: TriggerType.TIMESTAMP,
            timestamp: currentTime.getTime(),
          }
        );

        console.log(`Notification scheduled for ${currentTime.toLocaleTimeString()}`);

        currentTime = new Date(currentTime.getTime() + interval);
      } catch (error) {
        console.error('Error scheduling notification:', error);
      }
    }

    Alert.alert('Bildirimler Planlandı', `Başlangıç: ${startTime.toLocaleTimeString()}\nBitiş: ${endTime.toLocaleTimeString()}`);
  };

  return (
    <SafeAreaView>
      <View>
        <Button title="Bildirimleri Planla" onPress={scheduleNotifications} />
      </View>
    </SafeAreaView>
  );
};

export default App;
