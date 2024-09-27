import React, { useState, useRef,useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView,InteractionManager, TouchableWithoutFeedback, Keyboard  } from 'react-native';
import ReminderCreateHead from '../components/ReminderCreateHead';
import styles from '../styles/ReminderCreateStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { API_ROUTES } from '../utils/constant';
import axios from 'axios';
import FormModel from '../components/FormModel';
import HatirlatmaSaatleriModel from '../components/HatirlatmaSaatleriModel';
import DateTimePickerModal from 'react-native-modal-datetime-picker'; 
import { colors } from '../styles/colors';
import moment from 'moment';
import 'moment/locale/tr';


const ReminderCreate = ({ route, navigation }) => {
    const { name } = route.params;
    const [form, setForm] = useState('');
    const [kuvvet, setKuvvet] = useState('');
    const [firstDate, setFirstDate] = useState('');
    const [lastDate, setLastDate] = useState('');
    const [zamanlama, setZamanlama] = useState([]);

    const [modalVisible, setModalVisible] = useState(false); 
    const [kuvvetValue, setKuvvetValue] = useState(''); 
    const [selectedUnit, setSelectedUnit] = useState(''); 

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false); // Tarih Seçici için
    const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false); // Bitiş Tarihi Seçici

    const units = ['ml', 'IU', '%', 'mcg', 'mg','g','adet']; 
    const inputRef = useRef(null); // TextInput için referans oluşturun

    const [formModalVisible, setFormModalVisible] = useState(false); 

    const [zamanlamaModalVisible, setZamanlamaModalVisible] = useState(false); 



    const handleReminderSave = async () => {
        try {

    
            const formattedFirstDate = moment(firstDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
            const formattedLastDate = moment(lastDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
    
            const data = {
                name:name,
                form,
                kuvvet,
                baslangic_tarihi: formattedFirstDate,
                bitis_tarihi: formattedLastDate,
                saat_listesi: zamanlama, // Burada 'zamanlama' değişkeninin dolu olduğundan emin olun
            };
    
            const response = await axios.post(API_ROUTES.REMINDERS, data );
    
            navigation.replace('Hatırlatıcılar');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.error("Hata detayları:", error.response.data);
            } else {
                console.error("Unexpected error:", error);
            }
        }
    };
    
    

    const handleUnitPress = (unit) => {
        
        Keyboard.dismiss(); // Klavyeyi kapat
        setSelectedUnit(unit); // Seçim yapılacak
    };


    const handleSave = () => {
        if (kuvvetValue && selectedUnit) {
            setKuvvet(`${kuvvetValue} ${selectedUnit}`);
            setModalVisible(false);
        }
    };

    const openModal = () => {
        setModalVisible(true);
        // Use InteractionManager to delay focus until after all interactions are done
        InteractionManager.runAfterInteractions(() => {
            setTimeout(() => {
                if (inputRef.current) {
                    const length = kuvvetValue.length;  // Mevcut değerin uzunluğunu al
                    inputRef.current.focus();
                    inputRef.current.setSelection(length);  // Imleci metnin sonuna yerleştir
                }
            }, 300);  // Adjust the delay if necessary
        });
    };
    

    const openFormModal = () => {
        setFormModalVisible(true);
    };

    const openZamanlamaModal = () => {
        setZamanlamaModalVisible(true);
    };



    // Tarih seçici açma ve kapatma işlemleri
    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);

    const showEndDatePicker = () => setEndDatePickerVisibility(true);
    const hideEndDatePicker = () => setEndDatePickerVisibility(false);

    // Başlangıç tarihini seçip state'i güncelleme
    const handleConfirmStartDate = (date) => {
        const formattedDate = moment(date).format('DD/MM/YYYY'); // Gün/Ay/Yıl formatı
        setFirstDate(formattedDate);
        hideDatePicker();
    };
    
    const handleConfirmEndDate = (date) => {
        const formattedDate = moment(date).format('DD/MM/YYYY'); // Gün/Ay/Yıl formatı
        setLastDate(formattedDate);
        hideEndDatePicker();
    };



    return (
        <View style={styles.container}>
            <ReminderCreateHead />
            <View style={styles.secondContainer}>
                <Text style={styles.title}>Detaylar</Text>
                <View style={styles.inputWrapper}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>İsim</Text>
                        <Text style={styles.input} numberOfLines={1} ellipsizeMode="tail">{name}</Text>
                    </View>

                    <TouchableOpacity style={styles.inputContainer} onPress={openModal}>
                        <Text style={styles.label}>Ölçek</Text>
                        <View style={styles.formRightContainer}>
                            {kuvvet ? (
                                <Text style={styles.inputForm}>{kuvvet}</Text>
                            ) : (
                                <Text style={styles.Tree}>-</Text>
                            )}
                            <Ionicons name="chevron-forward-outline" size={16} color="#000" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.inputContainer} onPress={openFormModal}>
                            <Text style={styles.label}>Form</Text>
                            <View style={styles.formRightContainer}>
                                {form ? (
                                    <Text style={styles.inputForm}>{form}</Text>
                                ) : (
                                    <Text style={styles.Tree}>-</Text>
                                )}
                                <Ionicons name="chevron-forward-outline" size={16} color="#000" />
                            </View>
                    </TouchableOpacity>
                </View>

                <Text style={styles.titleSecond}>Zaman</Text>
                <View style={styles.inputWrapper}>
                    <TouchableOpacity style={styles.inputContainer} onPress={showDatePicker}>
                        <Text style={styles.label}>Başlangıç Tarihi</Text>
                        <View style={styles.formRightContainer}>
                            {firstDate ? (
                                <Text style={styles.inputForm}>{firstDate}</Text>
                            ) : (
                                <Text style={styles.Tree}>-</Text>
                            )}
                            <Ionicons name="chevron-forward-outline" size={16} color="#000" />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.inputContainer} onPress={showEndDatePicker}>
                        <Text style={styles.label}>Bitiş Tarihi</Text>
                        <View style={styles.formRightContainer}>
                            {lastDate ? (
                                <Text style={styles.inputForm}>{lastDate}</Text>
                            ) : (
                                <Text style={styles.Tree}>-</Text>
                            )}
                            <Ionicons name="chevron-forward-outline" size={16} color="#000" />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.inputContainerZaman} onPress={openZamanlamaModal}>
                        <Text style={styles.label}>Hatırlatma Saatleri</Text>
                        <View style={styles.zamanlamaRightContainer}>
                            {zamanlama.length > 0 ? (
                                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.inputZamanlama}>
                                    {zamanlama.join(', ')}
                                </Text>
                            ) : (
                                <Text style={styles.Tree}>-</Text>
                            )}
                            <Ionicons name="chevron-forward-outline" size={16} color="#000" style={styles.icon} />
                        </View>
                    </TouchableOpacity>
                </View>

               

                <Modal visible={modalVisible} transparent={true} animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.popup}>
                            <View>
                            <View style={styles.closeIcon}>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Ionicons name="arrow-back-outline" size={30} color="#000000" />
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.popupTitle}>Ölçek Bilgisi</Text>

                            <View style={styles.popupInputContainer} >
                                <Text style={styles.popupInputText}>Ölçek</Text>
                                <TextInput
                                    ref={inputRef}  // TextInput'a referans ekleyin
                                    style={styles.popupInput}
                                    keyboardType="numeric"
                                    value={kuvvetValue}
                                    onChangeText={setKuvvetValue}
                                />
                            </View>

                            <View style={styles.unitsMainContainer}>
                                <Text style={styles.unitsText}>Birim</Text>
                                <ScrollView
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.unitsContainer}
                                >
                                    {units.map((unit, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[
                                                styles.unitButton,
                                                selectedUnit === unit && styles.unitButtonSelected
                                            ]}
                                            onPress={() => handleUnitPress(unit)}
                                        >
                                            <Text
                                                style={[
                                                    styles.unitButtonText,
                                                    selectedUnit === unit && styles.unitButtonTextSelected
                                                ]}
                                            >
                                                {unit}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                            </View>

                            <View style={styles.popupButtons}>
                                <TouchableOpacity
                                    style={[styles.saveButton, !(kuvvetValue && selectedUnit) && styles.saveButtonDisabled]}
                                    onPress={handleSave}
                                    disabled={!(kuvvetValue && selectedUnit)}  // Butonun tıklanabilirliğini kontrol eder
                                >
                                    <Text style={styles.saveButtonText}>Kaydet</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </Modal>

                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirmStartDate}
                    onCancel={hideDatePicker}
                />

                <DateTimePickerModal
                    isVisible={isEndDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirmEndDate}
                    onCancel={hideEndDatePicker}
                />

                <FormModel  formModalVisible={formModalVisible} setFormModalVisible={setFormModalVisible} setForm={setForm}/>
                <HatirlatmaSaatleriModel  zamanlamaModalVisible={zamanlamaModalVisible} setZamanlamaModalVisible={setZamanlamaModalVisible} setZamanlama={setZamanlama} zamanlama={zamanlama}/>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[
                        styles.button,
                        (!(kuvvet && form && firstDate && lastDate) || (zamanlama.length === 0)) && styles.saveButtonDisabled
                    ]}
                    disabled={!(kuvvet && form && firstDate && lastDate) || zamanlama.length === 0}
                    onPress={handleReminderSave}
                >
                    <Text style={styles.buttonText}>Hatırlatıcı Oluştur</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ReminderCreate;

