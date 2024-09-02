import Config from 'react-native-config';


const API_KEY=Config.API_KEY



export const API_ROUTES = {
  // Authentication and Authorization Operations
  LOGIN: API_KEY + "/token/",
  LOGOUT: API_KEY + "/logout/",
  CHECK_TOKEN : API_KEY + "/check-token/",
  GET_USER : API_KEY + "/user-info/",
  USERS : API_KEY + "/users/",
  GET_PROFIL:API_KEY + '/profils/get_profile_by_user_id/data/',
  PUT_PROFIL:API_KEY + '/profils/update_profile_by_user_id/data/',
  RESET_PASSWORD_CODE : API_KEY +'/password-reset/request-reset/' ,
  RESET_PASSWORD : API_KEY +'/password-reset/reset-password/' ,

};






export const MESSAGES = {
  LOGIN_SUCCESS: "Giriş başarılı.",
  LOGOUT_SUCCESS: "Oturum kapatıldı.",
  TOKEN_EXPIRED: "Oturum süreniz sona erdi. Lütfen tekrar oturum açın.",

};

