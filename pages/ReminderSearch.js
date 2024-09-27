import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, ScrollView, TouchableOpacity, StyleSheet, Keyboard, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import styles from '../styles/ReminderSearchStyles';
import ReminderSearchHeader from '../components/ReminderSearchHeader';
import { API_ROUTES } from '../utils/constant';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [combinedData, setCombinedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const navigation = useNavigation(); // Access navigation

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(API_ROUTES.COMBINED);
        setCombinedData(response.data);
      } catch (error) {
        console.error('Veri çekme hatası:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSearchInput = (text) => {
    setSearchTerm(text);
    if (text.length > 0) {
      setIsSearching(true);
      const filtered = combinedData.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setIsSearching(false);
      setFilteredData([]);
    }
  };

  const handleSearchComplete = () => {
    if (searchTerm.trim() === '') {
      setIsSearching(false);
      setSearchTerm('');
      Keyboard.dismiss();
    }
  };

  const handleItemPress = (name) => {
    // Navigate to ReminderCreate and pass the name
    navigation.navigate('ReminderCreate', { name });
  };

  return (
    <View style={styles.container}>
      <ReminderSearchHeader />
      <View style={styles.secondContainer}>
        <View style={styles.searchBoxContainer}>
          <TextInput
            style={styles.searchBox}
            placeholder="İlaç, besin takviyesi ara."
            value={searchTerm}
            onChangeText={handleSearchInput}
            onFocus={() => setIsSearching(true)}
            onSubmitEditing={handleSearchComplete}
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={styles.loadingIndicator.color} />
        ) : !searchTerm && !isSearching ? (
          <ScrollView>
            <View style={styles.popularSearchesContainer}>
              <Text style={styles.sectionTitle}>Popüler Aramalar</Text>
              {combinedData.slice(0, 10).map((term, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSearchTerm(term.name);
                    setIsSearching(true);
                    handleSearchInput(term.name);
                  }}
                >
                  <Text style={styles.popularSearchItem}>{term.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleItemPress(item.name)} // Handle item press
              >
                <View style={styles.medicineItem}>
                  <View style={styles.medicineContent}>
                    <Text style={styles.medicineName}>{item.name}</Text>
                    {item.etken_madde ? (
                      <Text style={styles.medicineEtkenMadde}>{item.etken_madde}</Text>
                    ) : (
                      ''
                    )}
                  </View>
                  <View style={styles.iconContainer}>
                    <Ionicons
                      name="chevron-forward-outline"
                      size={16}
                      color="#000"
                    />
                  </View>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <Text style={styles.noResults}>Sonuç Bulunamadı</Text>
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

export default App;
