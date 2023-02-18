import axios from 'axios';
import { api as apiURL } from '../config/Backend';
import { Buffer } from "buffer";
import { Platform } from 'react-native';
import RNFetchBlob  from "rn-fetch-blob"
import AsyncStorage from '@react-native-community/async-storage';

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

interface RegisterationData {
  name: string;
  email: string;
  password: string;
  experience: string;
  implantsPerYear: string;
  specialityId: string;
}

export const extractLabel = async (image: string) => {
//  // console.log(`${apiURL}/implant/extractLabel`)
//  debugger;
  const token = await AsyncStorage.getItem("jwtToken");
//   const body = new FormData();
//   body.append('image', RNFetchBlob.wrap(image), 'image.jpeg');
  
//   fetch(`${apiURL}/implant/extractLabel`, {
//     method: 'POST',
//     headers: {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'multipart/form-data',
//       'Content-Disposition': 'form-data; name="image"; filename="image.jpeg"',
//     },
//     body,
//   })  
//   .then((response) => response.json())
//   .then((data) => {
//     console.log({data})
//   })
//   .catch((error) => {
//     console.log({error})
//   });
    
console.log({image})
const data = RNFetchBlob.wrap(Platform.OS === 'ios' ? image.replace('file://', '') : image);
console.log({data})
  return RNFetchBlob.fetch(
    'POST',
    `${apiURL}/implant/extractLabel`,
    { 'Content-Type': 'multipart/form-data',
    'Authorization': 'Bearer ' + token },
    [
      {
        name: 'image',
        filename: 'image',
        type: 'image/jpeg',
        data: data,
      },
    ],
  )
}

export const getMedicalConditions = () =>
  axios.get(`${apiURL}/constants/medicalConditions`);

export const getManufactures = () =>
  axios.get(`${apiURL}/constants/manufacturers`);

export const createVisit = (visitData: any) =>
  axios.post(`${apiURL}/visit`, visitData, config);

export const getSpecialities = () =>
  axios.get(`${apiURL}/constants/specialities`);

export const validateEmail = (email: string) =>
  axios.get(`${apiURL}/user/validate/email?email=${email}`);

export const register = (registerationData: RegisterationData) =>
  axios.post(`${apiURL}/user/register`, { ...registerationData }, config);

export const login = (email: string, password: string) =>
  axios.post(`${apiURL}/user/login`, { email, password }, config);

export const facebookLogin = (accessToken: string) =>
  axios.get(`${apiURL}/auth/facebook?access_token=${accessToken}`);

export const googleLogin = (accessToken: string) =>
  axios.get(`${apiURL}/auth/google?access_token=${accessToken}`);

export const linkedinLogin = (accessToken: string) =>
  axios.get(`${apiURL}/auth/linkedin?access_token=${accessToken}`);

export const twitterLogin = (
  authToken: string,
  secretToken: string,
  userId: string,
) =>
  axios.get(
    `${apiURL}/auth/twitter?oauth_token=${authToken}&oauth_token_secret=${secretToken}&user_id=${userId}`,
  );

export const forgotPassword = (email: string) =>
  axios.post(`${apiURL}/user/forgotPassword`, { email }, config);

export const verifyCode = (code: string, email: string) =>
  axios.post(`${apiURL}/user/confirmForgotPassword`, { code, email }, config);

export const resetPassword = (email: string, password: string, token: string) =>
  axios.post(
    `${apiURL}/user/resetPassword`,
    { email, password, token },
    config,
  );
export const updateAccount = (id: string, specialityId: string,
  experience: string, implantsPerYear: string) =>
  axios.post(`${apiURL}/user/update/${id}`, { specialityId, experience, implantsPerYear }, config);

export const updatePatient = (patientId: string, data: any) =>
  axios.post(`${apiURL}/patient/update/${patientId}`, data);
