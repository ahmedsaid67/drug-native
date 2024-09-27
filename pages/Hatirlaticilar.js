import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, Modal, Alert, TouchableWithoutFeedback, StyleSheet, Dimensions } from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import 'moment/locale/tr';
import { colors } from '../styles/colors';
import axios from 'axios';
import { API_ROUTES } from '../utils/constant';
import { useNavigation } from '@react-navigation/native';
import NoReminders from '../components/NoReminder';
import styles from '../styles/HatirlaticilarStyles';

const Hatirlaticilar = () => {
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const scrollViewRef = useRef();
  const navigation = useNavigation();

  moment.locale('tr');

  const screenWidth = Dimensions.get('window').width;

  const handlePress = () => {
    navigation.navigate('ReminderSearch');
  };

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
      if (hasMore) {
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
      }
    };

    fetchData();
  }, [page]);

  const fetchDataSelected = async (date) => {
    setLoading(true);
    setReminders([]);
    setPage(1);
    try {
      const response = await axios.get(API_ROUTES.USER_REMINDER_ACTİVE, {
        params: {
          date: date,
          page: 1
        }
      });
      setReminders(response.data.results);
      setHasMore(response.data.next !== null);
    } catch (error) {
      console.error("Error fetching reminders:", error);
    } finally {
      setLoading(false);
    }        
  }

  const handleDeleteReminder = async (id) => {
    try {
      await axios.patch(`${API_ROUTES.REMINDERS}${id}/`, { is_removed: true });
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
      await axios.put(API_ROUTES.REMINDER_STOPED.replace('data', id));
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
                fetchDataSelected(date);
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
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={!loading ? <NoReminders onAddReminder={handlePress} /> : null}
        ListFooterComponent={loading ? <ActivityIndicator size="small" color={colors.uygulamaRengi} /> : null}
      />

      <TouchableOpacity style={styles.floatingButton} onPress={handlePress}>
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback>
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
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default Hatirlaticilar;
