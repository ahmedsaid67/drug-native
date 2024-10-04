import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import styles from '../styles/BildirimlerStyles';
import { API_ROUTES } from '../utils/constant';
import axios from 'axios';
import { colors } from '../styles/colors';
import NoNotifications from '../components/NoNotifications';


function Bildirimler() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // Current page
  const [hasMore, setHasMore] = useState(true); // Flag to check if more data is available

  useEffect(() => {
    fetchNotifications();
  }, [page]); // Fetch notifications whenever the page changes
  

  const fetchNotifications = async () => {
    if (!hasMore) return; // Exit if there's no more data to fetch

    setLoading(true); // Start loading
    try {
      const response = await axios.get(`${API_ROUTES.NOTIFICATIONS_USER_LIST}?page=${page}`);
      const newNotifications = response.data.results;

      // Update state with new notifications
      setNotifications(prevNotifications => [...prevNotifications, ...newNotifications]);
      setHasMore(response.data.next !== null);
      
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleEndReached = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1); // Load the next page
    
    }
  };

  const renderNotification = ({ item }) => {
    const formattedTime = item.saat.split(':').slice(0, 2).join(':'); 
    return (
      <View key={item.id} style={styles.notificationCard}>
        <Text style={styles.description}>{item.explanations}</Text>
        <Text style={styles.date}>{item.tarih} - {formattedTime}</Text> 
      </View>
    );
  };
  

  return (
    <View style={styles.pageContainer}>
      <View style={styles.container}>
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.05}
          ListEmptyComponent={!loading ? <NoNotifications /> : null}
          ListFooterComponent={loading ? <ActivityIndicator size="small" color={colors.uygulamaRengi}  /> : null} 
        />
      </View>
    </View>
  );
}

export default Bildirimler;



