import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import styles from '../styles/ReminderCreateStyles';

const HatirlatmaSaatleriModel = ({ zamanlamaModalVisible, setZamanlamaModalVisible, setZamanlama, zamanlama }) => {

    const [addDate, setAddDate] = useState(['08:00']); // Saatleri tutacak state
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false); // Saat picker görünürlüğü için
    const [selectedTimeIndex, setSelectedTimeIndex] = useState(null); // Hangi saatin düzenlendiğini tutmak için

    // Saat picker açma
    const showDatePicker = (index) => {
        setSelectedTimeIndex(index); // Hangi saat tıklandıysa onu kaydediyoruz
        setDatePickerVisibility(true);
    };

    // Saat picker kapama
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
        setSelectedTimeIndex(null); // Seçimi sıfırlıyoruz
    };

    // Saat seçildiğinde çalışacak fonksiyon
    const handleConfirm = (date) => {
        const formattedTime = date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
        if (selectedTimeIndex !== null) {
            // Eğer bir saat güncelleniyorsa
            const updatedTimes = [...addDate];
            updatedTimes[selectedTimeIndex] = formattedTime; // Güncelleme
            setAddDate(updatedTimes);
        } else {
            // Yeni saat ekleniyorsa
            setAddDate([...addDate, formattedTime]);
        }
        hideDatePicker(); // Picker'ı kapat
    };

    // Saat silme fonksiyonu
    const handleDelete = (index) => {
        const updatedTimes = addDate.filter((_, i) => i !== index); // Seçilen saati filtreleyerek listeden çıkarma
        setAddDate(updatedTimes);
    };

    const handleSave = () => {
        setZamanlama(addDate); // Seçilen saatleri kaydet
        setZamanlamaModalVisible(false)
    };

    return (
        <Modal visible={zamanlamaModalVisible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.popup}>
                    <View style={styles.closeFormIcon}>
                        <TouchableOpacity onPress={() => setZamanlamaModalVisible(false)}>
                            <Ionicons name="arrow-back-outline" size={30} color="#000000" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.popupTitle}>Hatırlatma Saatleri</Text>

                    <ScrollView style={styles.DateMainContainer} showsVerticalScrollIndicator={false}>
                        {/* Seçilen saatleri listeleme */}
                        {addDate.map((time, index) => (
                            <View key={index} style={styles.DateContainer}>
                            <TouchableOpacity onPress={() => showDatePicker(index)} style={styles.DateTextContainer}>
                                <Text style={styles.DateText}>{time}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDelete(index)} style={styles.DeleteIconContainer}>
                                <Ionicons name="trash-outline" size={24} color="#000"/>
                            </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>

                    <TouchableOpacity style={styles.DateButonContainer} onPress={() => showDatePicker(null)}>
                        <Ionicons name="add" size={24} color="#000" />
                        <Text style={styles.DateButonText}>Saat Ekle</Text>
                    </TouchableOpacity>

                    <View style={styles.popupFormButtons}>
                        <TouchableOpacity
                            style={styles.saveFormButton}
                            onPress={handleSave}
                        >
                            <Text style={styles.saveButtonText}>Kaydet</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Saat seçimi için modal */}
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="time"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                        is24Hour={true} // 24 saat formatı kullanımı
                        locale="tr-TR" // Türkçe dil ayarı
                    />
                </View>
            </View>
        </Modal>
    );
};

export default HatirlatmaSaatleriModel;


