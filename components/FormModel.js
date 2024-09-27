import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ActivityIndicator, ScrollView, Image } from 'react-native';
import styles from '../styles/ReminderCreateStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { API_ROUTES } from '../utils/constant';
import axios from 'axios';
import { colors } from '../styles/colors';

const FormModel = ({ formModalVisible, setFormModalVisible, setForm }) => {
    const [selectedForm, setSelectedForm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState([]);

    useEffect(() => {
        const handleForm = async () => {
            try {
                const { data } = await axios.get(API_ROUTES.FORM);
                setFormData(data);
            } catch (error) {
                console.error("Error fetching form data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        handleForm();
    }, []);

    const handleSave = () => {
        if (selectedForm) {
            setForm(selectedForm);
            setFormModalVisible(false);
        }
    };

    return (
        <Modal visible={formModalVisible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.popup}>
                    <View style={styles.closeFormIcon}>
                        <TouchableOpacity onPress={() => setFormModalVisible(false)}>
                            <Ionicons name="arrow-back-outline" size={30} color="#000000" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.popupTitle}>Form</Text>

                    {isLoading ? (
                        <ActivityIndicator color={colors.uygulamaRengi} size="large" />
                    ) : (
                        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                            {formData.map((item,index) => (
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={() => setSelectedForm(item.name)}
                                    style={[
                                        styles.formItem,
                                        index === formData.length - 1 && styles.lastFormItem, // Son eleman için özel stil
                                    ]}
                                >
                                    {item.img && (
                                        <Image
                                            source={{ uri: item.img }}
                                            style={{ width: 32, height: 32, marginRight: 10 }} // Set appropriate size
                                        />
                                    )}
                                    <Text
                                        style={[
                                            styles.formItemText,
                                            selectedForm === item.name && { color: colors.uygulamaRengi }, // Seçilen item için renk değiştirme
                                        ]}
                                    >
                                        {item.name}
                                    </Text>
                                    {selectedForm === item.name && (
                                        <Ionicons
                                            name="checkmark-circle"
                                            size={32}
                                            color={colors.uygulamaRengi}
                                            style={{ marginLeft: 'auto' }} // Sağ tarafa itmek için
                                        />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}

                    <View style={styles.popupFormButtons}>
                        <TouchableOpacity
                            style={[styles.saveFormButton, !selectedForm && styles.saveButtonDisabled]}
                            onPress={handleSave}
                            disabled={!selectedForm}
                        >
                            <Text style={styles.saveButtonText}>Kaydet</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default FormModel;
