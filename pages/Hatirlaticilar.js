import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, FlatList, ActivityIndicator, Modal, Alert } from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import 'moment/locale/tr';
import { colors } from '../styles/colors';
import axios from 'axios';
import { API_ROUTES } from '../utils/constant';

const Hatirlaticilar = () => {
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const scrollViewRef = useRef();
  
  moment.locale('tr');

  const screenWidth = Dimensions.get('window').width;

  const getDates = () => {
    let dates = [];
    for (let i = -30; i <= 30; i++) {
      dates.push(moment().add(i, 'days').format('YYYY-MM-DD'));
    }
    return dates;
  };

  const dates = getDates();

  useEffect(() => {
    const todayIndex = dates.findIndex(date => date === selectedDate);
    const itemWidth = 60;
    const marginHorizontal = 20;
    const totalItemWidth = itemWidth + marginHorizontal;
    const offset = (todayIndex * totalItemWidth) - (screenWidth / 2) + (totalItemWidth / 2);

    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: offset, animated: true });
    }
  }, [selectedDate]);

  const isToday = selectedDate === moment().format('YYYY-MM-DD');
  const todayLabel = isToday 
    ? `Bugün ${moment(selectedDate).format('D MMMM')}` 
    : moment(selectedDate).format('D MMMM');

  useEffect(() => {
    const fetchData = async () => {
      if (loading || !hasMore) return;

      setLoading(true);
      try {
        const response = await axios.get(API_ROUTES.USER_REMINDER_ACTİVE, {
          params: {
            date: selectedDate,
            page: page
          }
        });
        setReminders(prevReminders => [...prevReminders, ...response.data.results]);
        setHasMore(response.data.next !== null);
      } catch (error) {
        console.error("Error fetching reminders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, selectedDate]);

  const handleDeleteReminder = async (id) => {
    try {
      await axios.patch(`${API_ROUTES.REMINDERS}${id}/`,{is_removed:true});
      setReminders(prevReminders => prevReminders.filter(reminder => reminder.id !== id));
      Alert.alert("Başarılı", "Hatırlatıcı başarıyla silindi.");
    } catch (error) {
      console.error("Error deleting reminder:", error);
      Alert.alert("Hata", "Hatırlatıcı silinemedi.");
    } finally {
      setModalVisible(false);
    }
  };

  const handlePauseReminder = async (id) => {
    try {
      await axios.put(API_ROUTES.REMINDER_STOPED.replace('data',id));
      Alert.alert("Başarılı", "Hatırlatıcı durduruldu.");
    } catch (error) {
      console.error("Error pausing reminder:", error);
      Alert.alert("Hata", "Hatırlatıcı durdurulamadı.");
    } finally {
      setModalVisible(false);
    }
  };

  const renderReminder = ({ item }) => {
    const startDate = moment(item.baslangic_tarihi).startOf('day');
    const endDate = moment(item.bitis_tarihi).endOf('day');
    
    const formattedStartDate = startDate.format('D MMMM');
    const formattedEndDate = endDate.format('D MMMM');
  
    return (
      <View style={styles.reminderContainer}>
        <View style={styles.reminderContent}>
          <Icon name="medkit" size={24} color="#1DA1F2" />
          <View style={styles.reminderTextContainer}>
            <Text style={styles.reminderText}>{item.name}</Text>
            <Text style={styles.reminderDetails}>
              {item.hatirlatici_saat.map((time, index) => (
                <Text key={index}>
                  {moment(time.saat, 'HH:mm:ss').format('HH:mm')}
                  {index < item.hatirlatici_saat.length - 1 ? ' - ' : ''}
                </Text>
              ))}
            </Text>
            <Text style={styles.reminderDaysLeft}>
              {`${formattedStartDate} - ${formattedEndDate}`}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => { setSelectedReminder(item); setModalVisible(true); }}>
          <Icon name="trash" size={24} color="#FF0000" style={styles.reminderIcon} />
        </TouchableOpacity>
      </View>
    );
  };

  const handleEndReached = () => {
    if (hasMore && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={scrollViewRef}
        >
          {dates.map((date, index) => (
            <TouchableOpacity
              key={index}
              style={[ 
                styles.dateContainer,
                date === selectedDate ? styles.selectedDate : null,
              ]}
              onPress={() => {
                setSelectedDate(date);
                setPage(1); // Reset page number to 1 on date change
                setReminders([]); // Clear previous reminders
                setHasMore(true); // Ensure more data can be fetched
              }}
            >
              <Text style={[ 
                styles.dateText,
                date === selectedDate ? styles.selectedDateText : null,
              ]}>
                {moment(date).format('DD')}
              </Text>
              <Text style={[ 
                styles.dayText,
                date === selectedDate ? styles.selectedDateText : null,
              ]}>
                {moment(date).format('ddd')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={[styles.todayLabel, { color: isToday ? '#1DA1F2' : '#14171A' }]}>{todayLabel}</Text>
      </View>

      <FlatList
        data={reminders}
        renderItem={renderReminder}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        ListFooterComponent={loading ? <ActivityIndicator size="small" color={colors.uygulamaRengi} /> : null}
      />


      <TouchableOpacity style={styles.floatingButton}>
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Icon name="close" size={24} color="#444" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Hatırlatıcıyı Yönet</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.pauseButton}
                onPress={() => handlePauseReminder(selectedReminder.id)}
              >
                <Text style={styles.actionText}>Durdur</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteReminder(selectedReminder.id)}
              >
                <Text style={styles.actionText}>Sil</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#f8f7fc',
  },
  dateSection: {
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 15,
    marginBottom:20,
  },
  dateContainer: {
    width: 60,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDate: {
    backgroundColor: '#1DA1F2',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#14171A',
  },
  dayText: {
    fontSize: 14,
    color: '#657786',
  },
  selectedDateText: {
    color: '#fff',
  },
  todayLabel: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1DA1F2',
  },
  reminderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    position: 'relative', // Add this to position children absolutely within it
  },
  reminderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Allow this to take up remaining space
  },
  reminderTextContainer: {
    marginLeft: 15,
    flex: 1, // Allow this to take up remaining space
  },
  reminderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#14171A',
  },
  reminderDetails: {
    marginTop: 5,
    fontSize: 14,
    color: '#657786',
  },
  reminderDaysLeft: {
    marginTop: 5,
    fontSize: 12,
    color: '#657786',
  },
  reminderIcon: {
    position: 'absolute', // Position absolutely within the container
    right: 10, // Adjust as needed
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Daha hafif bir şeffaflık
  },
  modalContainer: {
    width: '90%', // Modal genişliği artırıldı
    padding: 30, // Daha fazla padding
    backgroundColor: '#F2F2F2', // Açık gri tonunda sade bir renk
    borderRadius: 20, // Köşeler daha yumuşak
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  modalTitle: {
    fontSize: 22, // Başlık boyutu biraz artırıldı
    fontWeight: '700',
    color: '#333', // Koyu gri, profesyonel bir görünüm
    marginBottom: 30,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  pauseButton: {
    backgroundColor: '#6FA3EF', // Modern bir mavi tonu
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#FF5959', // Kırmızı tonunu biraz daha soft yaptık
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#1DA1F2',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Hatirlaticilar;
