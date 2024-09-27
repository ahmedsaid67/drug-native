import React, { useEffect } from 'react';
import { SafeAreaView, Button, View, Alert, Linking, Platform, PermissionsAndroid} from 'react-native';
import notifee, { AndroidImportance, TriggerType ,EventType} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



// bu function bildirimlerin her birinin ayırt edici kimliğinin listesini ve  bu bildirimlerin hangi ilaca dair olusturulduğu bilgisi tutar
// bu bilgileri kullanarak storageye kayıt atar. bu kayıtlar sayesınde olusturulan bildirimlerin kaydı cihazda saklanır.
// saha sonra bu kayıtları kullanarak, kullanıcı bıldırımlerı ıptal etmek ıstedıgınde edebılecegız. ayrıca son bıldırım de tamamlandıgı anı 
// yakalayabileceğiz.

const saveNotificationIds = async (medicationId, ids) => {
  try {
    const existingIds = JSON.parse(await AsyncStorage.getItem('notificationIds')) || {};
    existingIds[medicationId] = ids;
    await AsyncStorage.setItem('notificationIds', JSON.stringify(existingIds));
  } catch (error) {
    console.error('Error saving notification IDs:', error);
  }
};

//  x iacın bildirimlerini getir şeklinde function.

const getSavedNotificationIds = async (medicationId) => {
  try {
    const existingIds = JSON.parse(await AsyncStorage.getItem('notificationIds')) || {};
    return existingIds[medicationId] || [];
  } catch (error) {
    console.error('Error retrieving notification IDs:', error);
    return [];
  }
};


// aşağıda izin kodu bulunmaktadır. cihaz uygulanayı açtığında kullanıcıdan bildirim izni alınır. izin verilir ise bildirim işlemleri gerçekleşebilir.

const requestNotificationPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Error requesting permission:', err);
      return false;
    }
  }
  return true;
};


// aşağıdaki kodda ilk koşul kullanıcının bildirimler için izin verip verilmediğini sorgular. daha evvel izin verildi ise bildirim oluşturmaya izin verir
// izin yok ise izin vermez. belki burada bir derinlik katarız. bildirim için izin vermesi için tekar imakan verebiliriz.



// aşağıdaki kodda bildirimin başlangıç ve bitiş taraihi belirlenir, ve hangi aralıkta bildirim atılacağı belirlenir,
// bunun üzerinden bildirimler vakti ile birlikte üretilir.

// medicationId : ilacın ismini cismini temsil eder. x ilacına dair bildirim. bu sayede oluşrurulan veyahut bekleyen bildirimleri
// hangi ilaç için olduğunu tesbit edebiliyoruz.
// bunu kullanarak her bidlirim için ayırt edici kimlik oluşturuyoruz buna da id diyoruz. x ilacına dair bildiirm fakat  kimliği de bu şeklinde.

// medicatiınId bilgisi her ilaç için hatta her ilacı tekrar tekrar bildirim için ekleyebilirler onlar ıcınde dahı ayırt edici olmalıdır.
// x ilacın adı yetmeyebilir. yanına gunun tarıh bılgısı de ekleyıp olusturursak ayırt edıcı olur. xilac20mayıs24:20 şeklinde mesela...

// bu functıona bırde su kısmı eklemek lazım gelır.

// x ilacı adına bıldırımleri planlar iken x ialcın bildiriminin medicationId si kullanarak ve ilacın id sini kullanarak hatırlatacıİlaç
//  nesnesini creat etmeliyiz gerekli endpointi kullanrak.
// nesne de bir ilac bilgisi isteniyor, ilaç id gondermeliyiz birde medicationId gonderıp slug bilgisini sağlayacagız.
// bildirimin id ile hatırlatıcının slug aynı olması sayesınde bildirimden hatırlatıcıya ulasabılecegız.


const scheduleNotifications = async (medicationId) => {
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) {
    Alert.alert(
      'İzin Verilmedi',
      'Bildirim göndermek için izin vermeniz gerekiyor. Ayarlara gidip izin açmak ister misiniz?',
      [
        { text: 'Hayır', onPress: () => console.log('İzin verilmedi') },
        { text: 'Evet', onPress: () => Linking.openSettings() },
      ]
    );
    return;
  }

  const startTime = new Date();
  startTime.setMinutes(startTime.getMinutes() + 1);

  const endTime = new Date(startTime);
  endTime.setMinutes(endTime.getMinutes() + 3);

  const interval = 30 * 1000;

  let currentTime = startTime;
  const notificationIds = [];

  while (currentTime <= endTime) {
    try {
      const notificationId = `${medicationId}-${currentTime.getTime()}`;
      await notifee.createTriggerNotification(
        {
          id: notificationId, // bildirimin kimliği ayırt ediciliği sağlar. evet elimizde x ilacın bildirimi olduğu bilgisini medicationId ile sağlıyoruz fakat x ilacın hanghi bildirimi bilgisini o ayırt ediciliği tam burada sağlıyoruz.
          title: `Hatırlatıcı Bildirim (${medicationId})`,
          body: `Bu bir hatırlatıcı bildirimidir! (${medicationId})`,
          android: {
            channelId: 'reminder',
          },
          data: {
            medicationId: medicationId,  // bildirimin hangi ilacın bildirimi olduğu bilgisi. yani x ilacının bildirimi şeklinde.
          },
        },
        {
          type: TriggerType.TIMESTAMP,
          timestamp: currentTime.getTime(),  // oluşturulan bildirimin ne zaman kullanıcıya sunulacağı bilgisini burada belirtiyoruz.
        }
      );

      notificationIds.push(notificationId);  // her bildiirmin ayırt edici kimliğini listeye ekliyoruz

      console.log(`Notification for ${medicationId} scheduled for ${currentTime.toLocaleTimeString()} with ID ${notificationId}`);

      currentTime = new Date(currentTime.getTime() + interval);
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  await saveNotificationIds(medicationId, notificationIds);  // ayırt edici kimliklerin olduğu listeyi ve ilacın kimliğini functıona gonderıyoruz tetıkleyerek. burada x ilac ve onun bıldırımlerı listesini sunuyoruz. functıonun ustunde detaylı anlatacagım fakat storageye kayıtlar saglamak ıcın saglanan functıon.

  Alert.alert('Bildirimler Planlandı', `Başlangıç: ${startTime.toLocaleTimeString()}\nBitiş: ${endTime.toLocaleTimeString()}`);
};


// kullanıcı bildirimleri ipatl etmek istiyor ise bu functıonu tetıklıyoruz ve kanaldan mevcut bekleyen bıldırımlerı siliyoruz , strogeden de siliyoruz.

const cancelNotificationsByMedicationId = async (medicationId) => {
  try {
    const idsToCancel = await getSavedNotificationIds(medicationId);

    if (idsToCancel.length > 0) {
      for (const id of idsToCancel) {
        await notifee.cancelNotification(id);
        console.log(`Notification with ID ${id} cancelled`);
      }
      Alert.alert('Bildirimler İptal Edildi', `Tüm ${medicationId} bildirimleri başarıyla silindi.`);
      
      const existingIds = JSON.parse(await AsyncStorage.getItem('notificationIds')) || {};
      delete existingIds[medicationId];
      await AsyncStorage.setItem('notificationIds', JSON.stringify(existingIds));
    } else {
      console.log(`No notifications found for ${medicationId}`);
      Alert.alert('Bildirim Bulunamadı', `Hiç ${medicationId} bildirim bulunamadı.`);
    }
  } catch (error) {
    console.error('Error cancelling notifications by medication ID:', error);
  }
};

const App = () => {

  // bildirimler için kanal oluşturuyoruz. var ise mevcutu kullanıyoruz.
  useEffect(() => {
    const initializeNotificationChannel = async () => {
      try {
        const channels = await notifee.getChannels();
        const channelExists = channels.some(channel => channel.id === 'reminder');

        if (!channelExists) {
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
    
    // her bildirim atıldığında handleNotification functıonu tetikliyoruz. asıl amacımız her bildirim atıldıgında tetıklenen functıon sayesınde
    // bıldırımı backende kayıt ettırecek endpoıtnı tetıklemek olacak.
    const unsubscribe = notifee.onForegroundEvent(async ({ type, detail }) => {
      if (type === EventType.DELIVERED) {
        await handleNotification(detail.notification);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);


  // her bildirim yayınlandıdıgında bu functıony tetıklıyoruz. buraya bıldırım ıle ılgılı bılgıler gelıyor.
  // bu bilgileri kullanarak bildirim endpointi tetıkleyıp bıldıdımlerı kayıt ettıregız.
  // ayrıca kanaldan ve storegeden bıldırımı sılıyoruz. strogede bu sayede kac bıdlrıım bekledıgı bılgısı saglanabılıyor.

  const handleNotification = async (notification) => {
    try {
      console.log('Notification saved to database:', {
        title: notification.title,
        body: notification.body,
        data: notification.data,
        date: new Date(),
      });

      const existingIds = JSON.parse(await AsyncStorage.getItem('notificationIds')) || {};
      const medicationId = notification.data.medicationId;
      existingIds[medicationId] = existingIds[medicationId].filter(id => id !== notification.id);
      await AsyncStorage.setItem('notificationIds', JSON.stringify(existingIds));

      console.log("Bildirim ID'sini AsyncStorage'dan temizledi.");

      if (existingIds[medicationId].length === 0) {
        console.log(`Son bildirim teslim edildi ve işleme alınacak: ${medicationId}`);
        onLastNotificationDelivered(medicationId); // son bildirim de yayınlandıgında tetıkliyoruz bu sayede son bıldırımde yayınlandıktan sonra tetıkleyecegımız end poıntı calıstıracgız.
      }
    } catch (error) {
      console.error('Error handling notification:', error);
    }
  };
  
  // bildirimin medicationId bilgisi o bildirimler ile ilinitili hatırlatıcı ile aynı oldugundan hatırlatıcıya ulasıp onun aktıflıgı daıble yapacagız.
  // ek bir yontem. zaten bu functıonu tetıkleyen functıonda bıldırım uretyıyoruz ya son bıldırımı urettıgımızde ondan gelen bılgıler ıle de ılıskılı oldugu hatırlatıcıya ulasabılırızç
  const onLastNotificationDelivered = (medicationId) => {
    console.log(`Son bildirim tamamlandı (${notification})`);
    // Bu noktada istediğiniz işlevi tetikleyebilirsiniz
  };

  return (
    <SafeAreaView>
      <View>
        <Button title="X İlaç Bildirimlerini Planla" onPress={() => scheduleNotifications('x')} />
        <Button title="Y İlaç Bildirimlerini Planla" onPress={() => scheduleNotifications('y')} />
        <Button title="X İlaç Bildirimlerini Sil" onPress={() => cancelNotificationsByMedicationId('x')} />
        <Button title="Y İlaç Bildirimlerini Sil" onPress={() => cancelNotificationsByMedicationId('y')} />
      </View>
    </SafeAreaView>
  );
};

export default App;
