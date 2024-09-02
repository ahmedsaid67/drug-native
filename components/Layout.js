import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getToken, deleteToken } from '../storage/Storage';
import { setUser, userLoggedOut } from '../context/features/user/userSlice';
import { loginSuccess, logout } from '../context/features/auth/loginSlice';
import { showMessage } from '../context/features/message/messageSlice';
import AltBar from './AltBar';
import UstBar from './UstBar';
import { API_ROUTES } from '../utils/constant';
import Message from './Message';

const Layout = ({ children, currentRoute }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    axios.defaults.headers.common["Accept-Language"] = "tr-tr";
    axios.defaults.baseURL = API_ROUTES;
    axios.interceptors.response.use(
      (response) => response,
      async (err) => {
        if (err.response?.status === 401) {
          axios.defaults.headers.common["Authorization"] = null;
          if (getToken("token"))
            dispatch(
              showMessage({
                message: "Görünüşe göre token'ınız geçersiz olabilir ya da bellekten silinmiş olabilir. Lütfen tekrar giriş yapın.",
                variant: "info",
              })
            );
          deleteToken();
          dispatch(userLoggedOut());
          dispatch(logout());
          return Promise.reject(err);
        }
        return Promise.reject(err);
      }
    );

    async function getUser() {
      try {
        const res = await axios.get(API_ROUTES.GET_USER);
        dispatch(loginSuccess());
        dispatch(setUser(res.data));
      } catch (err) {
        console.log(err);
      }
    }

    async function token() {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        getUser();
      } else {
        console.log("Token not found");
      }
    }
    token();
    console.log("check")

  }, [dispatch]);

  const showBars = ["Ana Sayfa", "Arama", "Bildirimler", "Hatırlatıcılar"].includes(currentRoute);

  return (
    <View style={{ flex: 1 }}>
      {showBars && <UstBar />}
      <View style={{ flex: 1 }}>
        {children}
      </View>
      {showBars && <AltBar />}
      <Message/>
    </View>
  );
};

export default Layout;
