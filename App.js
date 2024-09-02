import { tr } from 'date-fns/locale';
import React, { useState, useEffect } from 'react';
import { Button, TextInput, View, Text, Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';

// Bildirimleri zamanla
async function scheduleNotifications(startTime, endTime, intervalMinutes) {
  const start = new Date(`1970-01-01T${startTime}:00Z`).getTime(); // UTC kullanımı
  const end = new Date(`1970-01-01T${endTime}:00Z`).getTime();
  const interval = parseInt(intervalMinutes, 10) * 60 * 1000; // dakika -> milisaniye

  
  if (isNaN(interval) || interval <= 0 || start >= end) {
    console.log('Geçersiz aralık veya saatler');
    return;
  }

  let current = start;
  const notificationTimes = [];

  while (current <= end) {
    notificationTimes.push(current);
    current += interval;
  }

  console.log("notificationTimes:", notificationTimes.map(time => new Date(time).toISOString()));

  // Bildirimleri zamanla
  notificationTimes.forEach((time) => {
    console.log(`Bildirim Zamanı: ${new Date(time).toLocaleString()}`);
    PushNotification.localNotificationSchedule({
      channelId: "default-channel-id",
      title: "Planlı Bildirim",
      message: "Bu bir planlı bildirim",
      date: new Date(time),
      allowWhileIdle: true,
      playSound: true,
      soundName: "default",
      vibrate: true,
    });
  });

  console.log('Tüm bildirimler zamanlandı.');
}

const manuelNotification=()=>{
  PushNotification.localNotificationSchedule({
    channelId: "default-channel-id",
      title: "Planlı Bildirim",
      message: "Bu bir planlı bildirim",
      date: new Date(Date.now() + 20 *1000),

  })
  console.log("check")
}





// İzinleri talep eden fonksiyon
async function requestPermissions() {
  if (Platform.OS === 'android') {
    if (Platform.Version >= 33) {
      const hasNotificationPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      console.log('Bildirim İzni Var mı:', hasNotificationPermission);
      if (!hasNotificationPermission) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        console.log('Bildirim İzni Talep Sonucu:', granted);
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Bildirim izni reddedildi');
          return;
        }
      }
    }

    if (Platform.Version >= 31) {
      try {
        const granted = await PermissionsAndroid.request(
          'android.permission.SCHEDULE_EXACT_ALARM'
        );
        console.log('Tam Alarm İzni Talep Sonucu:', granted);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Tam alarm izni verildi');
        } else {
          console.log('Tam alarm izni reddedildi');
        }
      } catch (err) {
        console.warn('İzin talebi başarısız:', err);
      }
    }
  }
}

// Ana bileşen
function App() {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [intervalMinutes, setIntervalMinutes] = useState('');

  const startDate=new Date()
  const endDate =new Date(startDate.getTime()+10*60*1000)


  useEffect(() => {
    console.log('İzinler talep ediliyor...');
    requestPermissions();

    // Bildirim kanalı oluşturma
    PushNotification.createChannel(
      {
        channelId: "default-channel-id",
        channelName: "Varsayılan Kanal",
        channelDescription: "Varsayılan bir kanal",
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`createChannel döndürüldü '${created}'`)
    );
  }, []);


  const scheduleTestNotifications=(startDate,endDate,intervalMinutes)=>{
  console.log("chechk2222")
  intervalMiliseconds=intervalMinutes * 60 * 1000
  let notificationDate = new Date(startDate).getTime()
  const endTime = new Date (endDate).getTime();
  while (notificationDate <=endTime){
    PushNotification.localNotificationSchedule({
      hannelId: "default-channel-id",
      title: "Planlı Bildirim",
      message: "Bu bir planlı bildirim",
      date: new Date(notificationDate),
      allowWhileIdle:true,
      playSound:true,
      soundName:"default",
      vibrate:true,
      vibration:300
    })
    notificationDate+=intervalMiliseconds;
  }
}

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ marginBottom: 20 }}>Push Bildirim Planlayıcı</Text>
      <TextInput
        placeholder="Başlangıç Saati (HH:MM)"
        value={startTime}
        onChangeText={setStartTime}
        style={{ borderBottomWidth: 1, marginBottom: 10, width: '80%' }}
      />
      <TextInput
        placeholder="Bitiş Saati (HH:MM)"
        value={endTime}
        onChangeText={setEndTime}
        style={{ borderBottomWidth: 1, marginBottom: 10, width: '80%' }}
      />
      <TextInput
        placeholder="Aralık Dakikası"
        value={intervalMinutes}
        onChangeText={setIntervalMinutes}
        keyboardType="numeric"
        style={{ borderBottomWidth: 1, marginBottom: 10, width: '80%' }}
      />
      <Button title="Planla" onPress={manuelNotification} />
    </View>
  );
}

export default App;

// scheduleNotifications(startTime, endTime, intervalMinutes)}