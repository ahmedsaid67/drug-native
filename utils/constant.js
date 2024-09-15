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
  GOGLE_LOGIN: API_KEY + '/google/',


  MEDICINE : API_KEY + '/ilac/?pages=currentPage',  // --> pagination'ludur, tüm ilaçları 20'şer 20'şer döndürür.
  MEDICINE_BY_CATEGORY : API_KEY + '/ilac/medications_by_category/', // --> pagination'ludur, kategoriye ait ilaçları 20'şer 20'şer döndürür.
  MEDICINE_BY_CATEGORY_NO_PAGINATION: API_KEY + '/ilac/medications_by_category_no_pagination/',  // --> paginationsuzdur. kategirye ait tüm ilaçları döndürür. kategori sayfalarının searchboxu ıcın kullanaılacak endpoint.
  
  MEDICINE_CATEGORY : API_KEY + '/ilac-kategori/', // --> paginationsuzdur.

  GET_DOSAGE_BY_AGE : API_KEY + '/yasdoz/get_dosage_by_age',  // yaş doz
  GET_DOSAGE_BY_WEIGHT : API_KEY + '/kilodoz/get_dosage_by_weight/',  // kilo doz

  GET_DOSAGE_BY_EXPLANATION : API_KEY + '/explanationdoz/get_dosage_by_explanation/', // explanation doz

  GET_DOSAGE_BY_AGE_AND_DISEASE : API_KEY + '/hastalikyasdoz/get_dosage_by_age_and_disease/',  // hastalık yaş doz
  GET_DOSAGE_BY_WEIGHT_AND_DISEASE : API_KEY + '/hastalikkilodoz/get_dosage_by_weight_and_condition/', // hastalık kilo doz

  GET_DOSAGE_INCREASING_WEIGHT : API_KEY + '/artankilodoz/get_artan_doz_kilo/',  // artan doz kilo
  GET_DOSAGE_DECREASING_WEIGHT : API_KEY + '/azalankilodoz/get_azalan_doz_kilo/', // azalan doz kilo

  GET_INCREASED_DOSAGE_BY_DISEASE_AND_WEIGHT : API_KEY + '/hastalikartankilodoz/get_hastalik_artan_doz_kilo/', // hastalık ve kıloya gore artan doz
  GET_DECREASED_DOSAGE_BY_DISEASE_AND_WEIGHT : API_KEY + '/hastalikazalankilodoz/get_hastalik_azalan_doz_kilo/', // hastalık ve kıloya gore azalan doz

  GET_INCREASED_DOSAGE_BY_DISEASE_AGE_AND_WEIGHT : API_KEY + '/hastalikhemyasahemkiloyabagliartandoz/get_hastalik_artan_doz_hem_kilo_hem_yas/', // hastalık , hem kıloya hem yasa gore artan doz
  GET_INCREASED_DOSAGE_BY_DISEASE_AGE_AND_WEIGHT_DATA_AGE : API_KEY + '/hastalikhemyasahemkiloyabagliartandoz/get_detail_data/', // eşik olan yaş bilgisini alıyoruz

  GET_DECREASING_DOSE_BY_DISEASE_AGE_WEIGHT : API_KEY + '/hastalikhemyasahemkiloyabagliazalandoz/get_hastalik_azalan_doz_hem_kilo_hem_yas/', // hastalık , hem kıloya hem yasa gore azalan doz
  GET_DECREASING_DOSE_BY_DISEASE_AGE_WEIGHT_DATA_AGE : API_KEY + '/hastalikhemyasahemkiloyabagliazalandoz/get_detail_data/', // eşik olan yaş bilgisini alıyoruz

  SUPPLEMENT : API_KEY + '/supplement/', // BESİN TAKVİYELERİ
  SUPPLEMENT_BY_PRODUCT_CATEGORY : API_KEY + '/productcategory/list_categories_by_supplement/',  // BESİN TAKVİYESİNE GORE ÜRÜN KATEGORİLERİ  -- VİTAMİNLERE DİAR KATEGORİLERİ GETİRİ
  PRODUCT_CATEGORY_BY_PRODUCT : API_KEY + '/product/list_prodcuts_by_productcategory/', // ÜRÜN KATEGORİSİNE GÖRE ÜRÜNLER -- A VİTAMİNİN DAİR ÜRÜNLERİ GETİRİR



};






export const MESSAGES = {
  LOGIN_SUCCESS: "Giriş başarılı.",
  LOGOUT_SUCCESS: "Oturum kapatıldı.",
  TOKEN_EXPIRED: "Oturum süreniz sona erdi. Lütfen tekrar oturum açın.",

};

