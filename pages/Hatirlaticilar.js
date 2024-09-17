import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, FlatList, ActivityIndicator } from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import 'moment/locale/tr';
import { colors } from '../styles/colors';
import axios from 'axios';
import { API_ROUTES } from '../utils/constant';

const Hatirlaticilar = () => {
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [activeTab, setActiveTab] = useState('Aktif');
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
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
      const endpoint = activeTab === 'Aktif'
        ? API_ROUTES.USER_REMINDER_ACTİVE
        : API_ROUTES.USER_REMINDER_INACTIVE;
        
      try {
        const response = await axios.get(endpoint, {
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
  }, [page, activeTab, selectedDate]); // `selectedDate` eklenmiş

  const renderReminder = ({ item }) => {
    const startDate = moment(item.baslangic_tarihi).startOf('day');
    const endDate = moment(item.bitis_tarihi).endOf('day');
    const today = moment().startOf('day');
    
    let displayText = '';
    const daysUntilStart = startDate.diff(today, 'days');
    const daysUntilEnd = endDate.diff(today, 'days');

    if (startDate.isAfter(today)) {
      displayText = `Başlamasına ${daysUntilStart} gün kaldı`;
    } else if (startDate.isSameOrBefore(today)) {
      if (daysUntilEnd >= 0) {
        displayText = `Tamamlanmasına ${daysUntilEnd} gün kaldı`;
      } else {
        displayText = 'Tamamlandı';
      }
    }

    return (
      <View style={styles.reminderContainer}>
        <View style={styles.reminderContent}>
          <Icon name="medkit" size={24} color="#1DA1F2" />
          <View style={styles.reminderTextContainer}>
            <Text style={styles.reminderText}>{item.name}</Text>
            <Text style={styles.reminderDetails}>
              {item.hatirlatici_saat.map((time, index) => (
                <Text key={index}>{moment(time.saat, 'HH:mm:ss').format('HH:mm')}{index < item.hatirlatici_saat.length - 1 ? ' - ' : ''}</Text>
              ))}
            </Text>
            <Text style={styles.reminderDaysLeft}>
              {displayText}
            </Text>
          </View>
        </View>
        <Icon name="clock-o" size={24} color="#1DA1F2" style={styles.reminderIcon} />
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

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Aktif' ? styles.activeTab : null]}
          onPress={() => {
            setActiveTab('Aktif');
            setPage(1); // Reset page number to 1 on tab change
            setReminders([]); // Clear previous reminders
            setHasMore(true); // Ensure more data can be fetched
          }}
        >
          <Text style={[styles.tabText, activeTab === 'Aktif' ? styles.activeTabText : null]}>
            Aktif
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Aktif Olmayan' ? styles.activeTab : null]}
          onPress={() => {
            setActiveTab('Aktif Olmayan');
            setPage(1); // Reset page number to 1 on tab change
            setReminders([]); // Clear previous reminders
            setHasMore(true); // Ensure more data can be fetched
          }}
        >
          <Text style={[styles.tabText, activeTab === 'Aktif Olmayan' ? styles.activeTabText : null]}>
            Aktif Olmayan
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={reminders}
        renderItem={renderReminder}
        keyExtractor={item => item.id.toString()} // Benzersiz `id` kullanılıyor
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        ListFooterComponent={loading ? <ActivityIndicator size="small" color={colors.uygulamaRengi} /> : null}
      />

      <TouchableOpacity style={styles.floatingButton}>
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  dayText: {
    fontSize: 14,
  },
  selectedDateText: {
    color: '#FFFFFF',
  },
  todayLabel: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#14171A',
  },
  activeTab: {
    borderBottomColor: '#1DA1F2',
  },
  activeTabText: {
    color: '#1DA1F2',
  },
  reminderContainer: {
    position: 'relative',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 15,
    marginHorizontal: 30,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reminderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  reminderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  reminderDetails: {
    fontSize: 14,
    color: '#333',
  },
  reminderDaysLeft: {
    fontSize: 14,
    color: '#1DA1F2',
  },
  reminderIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
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
