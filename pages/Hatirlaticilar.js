import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import 'moment/locale/tr'; // Türkçe dil desteği


const Hatirlaticilar = () => {
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [activeTab, setActiveTab] = useState('Aktif'); // State for active tab
  const scrollViewRef = useRef();

  // Türkçe dilini ayarlıyoruz
  moment.locale('tr');

  // Cihaz ekran genişliği
  const screenWidth = Dimensions.get('window').width;

  // Tarih aralığını oluştur (30 gün önce ve 30 gün sonrası)
  const getDates = () => {
    let dates = [];
    for (let i = -30; i <= 30; i++) {
      dates.push(moment().add(i, 'days').format('YYYY-MM-DD'));
    }
    return dates;
  };

  const dates = getDates();

  // Ekran yüklendiğinde bugünün tarihini ortalamak için
  useEffect(() => {
    // Bugünün tarihini tarihler arasında bul
    const todayIndex = dates.findIndex(date => date === selectedDate);

    // Her bir elemanın genişliği (60px genişlik, + 20px sağ ve sol margin ile birlikte)
    const itemWidth = 60; // Eleman genişliği
    const marginHorizontal = 20; // Sağa ve sola margin (10px sağ, 10px sol)
    const totalItemWidth = itemWidth + marginHorizontal; // Toplam eleman genişliği

    // Elemanı tam ortalamak için hesaplama
    const offset = (todayIndex * totalItemWidth) - (screenWidth / 2) + (totalItemWidth / 2);

    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: offset, animated: true });
    }
  }, [selectedDate]);

  // Bugün tarihi ve seçili tarihleri karşılaştır
  const isToday = selectedDate === moment().format('YYYY-MM-DD');
  const todayLabel = isToday 
    ? `Bugün ${moment(selectedDate).format('D MMMM')}` 
    : moment(selectedDate).format('D MMMM');

  return (
    <View style={styles.container}>
      <View style={styles.dateSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={scrollViewRef}  // ScrollView referansı
        >
          {dates.map((date, index) => (
            <TouchableOpacity
              key={index}
              style={[ 
                styles.dateContainer,
                date === selectedDate ? styles.selectedDate : null,
              ]}
              onPress={() => setSelectedDate(date)}
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
                {moment(date).format('ddd')} {/* Haftanın günü Türkçe gösterilecek */}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={[styles.todayLabel, { color: isToday ? '#1DA1F2' : '#14171A' }]}>
          {todayLabel}
        </Text>
      </View>

      {/* Tab Section */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Aktif' ? styles.activeTab : null]}
          onPress={() => setActiveTab('Aktif')}
        >
          <Text style={[styles.tabText, activeTab === 'Aktif' ? styles.activeTabText : null]}>
            Aktif
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Aktif Olmayan' ? styles.activeTab : null]}
          onPress={() => setActiveTab('Aktif Olmayan')}
        >
          <Text style={[styles.tabText, activeTab === 'Aktif Olmayan' ? styles.activeTabText : null]}>
            Aktif Olmayan
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.reminderContainer}>
        <View style={styles.reminderContent}>
          <Icon name="medkit" size={24} color="#1DA1F2" />
          <View style={styles.reminderTextContainer}>
            <Text style={styles.reminderText}>Parol</Text>
            <Text style={styles.reminderDetails}>Günde 2 kez - 08:00 20:00</Text>
            <Text style={styles.reminderDaysLeft}>5 gün kaldı</Text>
          </View>
        </View>
        <Icon name="clock-o" size={24} color="#1DA1F2" style={styles.reminderIcon} />
      </View>


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
    position: 'relative', // Allow positioning child elements relative to this container
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 15,
    marginHorizontal: 15,
  },
  reminderContent: {
    flexDirection: 'row', // Aligns items horizontally within the content
    alignItems: 'flex-start', // Align items at the top
  },
  reminderTextContainer: {
    marginLeft: 10, // Space between icon and text
  },
  reminderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color:'#666666',
  },
  reminderDetails: {
    fontSize: 14,
    color:'#666666',
  },
  reminderDaysLeft: {
    fontSize: 14,
    color: '#FF0000',
  },
  reminderIcon: {
    position: 'absolute',
    bottom: 10, // Distance from the bottom of the container
    right: 10, // Distance from the right of the container
  },
});

export default Hatirlaticilar;
