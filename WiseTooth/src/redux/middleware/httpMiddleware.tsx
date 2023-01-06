import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

const httpMiddleware = ({ dispatch, getState }) => next => async action => {
    const { token } = await getState().auth;
    AsyncStorage.setItem("jwtToken", token)
    axios.defaults.headers = {
      Authorization: `Bearer ${token}`
    }
    
    return next(action);
}


export default httpMiddleware;