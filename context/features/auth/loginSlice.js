import { createSlice } from '@reduxjs/toolkit';
import axios from "axios";
import { showMessage } from '../message/messageSlice';
import { setUser,userLoggedOut } from '../user/userSlice';
import { deleteToken,storeToken,getToken } from '../../../storage/Storage';
import { API_ROUTES } from '../../../utils/constant';


export const submitLogin = (email, password) => async (dispatch) => {
  try {
    dispatch(loginLoading());

    const response = await axios.post(API_ROUTES.LOGIN, { email, password });

    if (!response?.data?.token) {
      dispatch(
        showMessage({
          message: "Geçersiz email veya şifre. Lütfen bilgilerinizi kontrol edin.",
          variant: "error",
        })
      );
      dispatch(loginError("Geçersiz email veya şifre."));
      return;
    }

    storeToken(response.data.token);
    axios.defaults.headers.common["Authorization"] = `Token ${response.data.token}`;

    try {
      const userResponse = await axios.get(API_ROUTES.GET_USER);
      dispatch(setUser(userResponse.data));
    } catch {
      dispatch(
        showMessage({
          message: "Kullanıcı bilgileri getirilemedi.",
          variant: "error",
        })
      );
    }

    dispatch(loginSuccess());
    dispatch(
      showMessage({
        message: "Başarıyla giriş yapıldı!",
        variant: "success",
      })
    );

  } catch (err) {
    if (err.response) {
      const emailErrorMessage = "Enter a valid email address.";
      if (err.response.data?.email?.[0] === emailErrorMessage) {
        dispatch(
          showMessage({
            message: "Geçerli bir email adresi giriniz.",
            variant: "error",
          })
        );
        dispatch(loginError("Geçerli bir email adresi giriniz."));
      } else {
        dispatch(
          showMessage({
            message: "Giriş işleminizde bir sorun oluştu. Lütfen bilgilerinizi kontrol edin ve tekrar deneyin.",
            variant: "error",
          })
        );
        dispatch(loginError("Giriş işleminizde bir sorun oluştu."));
      }
    } else {
      dispatch(
        showMessage({
          message: "Giriş işleminizde bir sorun oluştu. Lütfen bilgilerinizi kontrol edin ve tekrar deneyin.",
          variant: "error",
        })
      );
      dispatch(loginError("Giriş işleminizde bir sorun oluştu."));
    }
  } finally {
    dispatch(loginLoadingDone());
  }
};






export const submitCreate = (email, password, firstName, lastName) => async (dispatch) => {
  try {
    dispatch(loginLoading());

    // Kullanıcıyı oluşturma isteği
    await axios.post(API_ROUTES.USERS, {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
    });

    // Kullanıcıyı otomatik olarak giriş yapma
    const loginResponse = await axios.post(API_ROUTES.LOGIN, { email, password });

    // Token'ı saklama ve başlık ayarlama
    storeToken(loginResponse.data.token);
    axios.defaults.headers.common["Authorization"] = `Token ${loginResponse.data.token}`;

    // Kullanıcı bilgilerini alma

    const userResponse = await axios.get(API_ROUTES.GET_USER);
    dispatch(setUser(userResponse.data));
   

    // Başarılı kayıt ve giriş mesajı
    dispatch(loginSuccess());
    dispatch(
      showMessage({
        message: "Kayıt başarılı! Başarıyla giriş yapıldı!",
        variant: "success",
      })
    );

  } catch (err) {
    console.log("Kullanıcı oluşturulurken bir hata oluştu: ", err);

    if (err?.response?.data?.email) {
      const emailErrors = err.response.data.email;

      let errorMessage = "E-posta hatası: ";
      if (emailErrors.includes("Enter a valid email address.")) {
        errorMessage += "Geçerli bir e-posta adresi girin.";
      } else if (emailErrors.includes("custom user with this email already exists.")) {
        errorMessage += "Bu e-posta adresiyle zaten bir kullanıcı var.";
      } else {
        errorMessage += emailErrors.join(', ');
      }

      dispatch(showMessage({
        message: errorMessage,
        variant: "error",
      }));
      dispatch(loginError(errorMessage));
      
    } else if (err?.response?.data?.password) {
      const passwordErrors = err.response.data.password;
      dispatch(showMessage({
        message: `Şifre hatası: ${passwordErrors.join(', ')}`,
        variant: "error",
      }));
      dispatch(loginError(passwordErrors.join(', ')));
    } else if (err?.response?.data?.non_field_errors) {
      const nonFieldErrors = err.response.data.non_field_errors;
      dispatch(showMessage({
        message: `Hata: ${nonFieldErrors.join(', ')}`,
        variant: "error",
      }));
      dispatch(loginError(nonFieldErrors.join(', ')));
    } else {
      // Genel hata mesajı
      dispatch(showMessage({
        message: "Kayıt işleminizde bir hata meydana geldi. Lütfen tüm bilgilerinizi doğru girdiğinizden emin olun ve tekrar deneyin.",
        variant: "error",
      }));
      dispatch(loginError("Kayıt işleminizde bir hata meydana geldi. Lütfen tüm bilgilerinizi doğru girdiğinizden emin olun ve tekrar deneyin."));      
    }

  } finally {
    dispatch(loginLoadingDone());
  }
};

  




export const submitLogout = () => async (dispatch) => {
  try {
    const response = await axios({
      method: "post",
      url: API_ROUTES.LOGOUT, 
    });
    if (response?.data?.detail) {
      console.log("Something went wrong during logout: ", response);
      // dispatch(loginError(response));
      return;
    }
    axios.defaults.headers.common["Authorization"] = null;
    deleteToken();
    dispatch(userLoggedOut());
    dispatch(logout());
    dispatch(
      showMessage({
        message: "çıkış yapıldı",
        variant: "success",
      })
    );

   
    
  } catch (err) {
    console.log("Some error occured during signing in: ", err);
    err?.response?.data?.non_field_errors?.map((error) => {
      dispatch(
        showMessage({
          message: error,
          variant: "error",
        })
      );
      // dispatch(loginError(error));
    });
  } finally {
    // dispatch(loginLoadingDone());
  }
};





const initialState= {
  success: false,
  loading: false,
  errors: [],
}

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    loginLoading: (state, action) => {
      state.loading = true;
    },
    loginLoadingDone: (state, action) => {
      state.loading = false;
    },
    loginSuccess: (state, action) => {
      state.success = true;
      state.errors = [];
    },
    loginError: (state, action) => {
      state.success = false;
      state.errors = action.payload;
    },
    logout: (state) => {
      state.success = false;
    },
  },
});

export const {
  loginLoading,
  loginLoadingDone,
  loginSuccess,
  loginError,
  logout,
} = loginSlice.actions;

export default loginSlice.reducer;
