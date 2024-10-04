import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import styles from '../styles/HatirlaticilarStyles';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API_ROUTES } from '../utils/constant';
import notifee from '@notifee/react-native';

const HatirlaticiYonetModel = ({ modalVisible, setModalVisible, setSelectedReminder, selectedReminder, setReminders  }) => {
    const handleDeleteReminder = async (id) => {
        try {
            await axios.patch(`${API_ROUTES.REMINDERS}${id}/`, { is_removed: true });
            setReminders(prevReminders => prevReminders.filter(reminder => reminder.id !== id));
            const notifications = await notifee.getTriggerNotifications();
            for (let notification of notifications) {
                if (notification.notification.data.medicationId === id) {
                    await notifee.cancelTriggerNotification(notification.notification.id);
                }
            }
        } catch (error) {
            console.error("Error deleting reminder:", error);
        } finally {
            setModalVisible(false);
            setSelectedReminder("");
        }
    };

    const handlePauseReminder = async (id) => {
        try {
            await axios.put(API_ROUTES.REMINDER_STOPED.replace('data', id));
            setReminders(prevReminders =>
                prevReminders.map(reminder =>
                    reminder.id === id ? { ...reminder, is_stopped: true } : reminder
                )
            );
            const notifications = await notifee.getTriggerNotifications();
            for (let notification of notifications) {
                if (notification.notification.data.medicationId === id) {
                    await notifee.cancelTriggerNotification(notification.notification.id);
                }
            }
        } catch (error) {
            console.error("Error pausing reminder:", error);
        } finally {
            setModalVisible(false);
            setSelectedReminder("");
        }
    };

    return (
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
                                <Icon name="close" size={24} color="#555" />
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Hatırlatıcıyı Yönet</Text>
                            <Text style={styles.uyariText}>Hatırlatıcıyı durdurur yada silerseniz bildirim alamayacaksınız.</Text>
                            <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[
                                    styles.pauseButton,
                                    selectedReminder.is_stopped && styles.disabledButton // Eğer is_stopped true ise farklı bir stil uygula
                                ]}
                                onPress={() => handlePauseReminder(selectedReminder.id)}
                                disabled={selectedReminder.is_stopped} // is_stopped true ise buton devre dışı
                            >
                                <Text style={styles.actionText}>
                                    {selectedReminder.is_stopped ? 'Durduruldu' : 'Durdur'} {/* Buton metnini de dinamik hale getir */}
                                </Text>
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
    );
};

export default HatirlaticiYonetModel;
