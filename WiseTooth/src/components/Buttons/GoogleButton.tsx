import React from 'react';
import {TouchableOpacity} from 'react-native';
// @ts-ignore
import Google from '../../../assets/images/google.svg';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import {googleWebClientId} from '../../config/keys';

GoogleSignin.configure({
  webClientId: googleWebClientId,
  offlineAccess: true,
  hostedDomain: '',
  forceCodeForRefreshToken: true,
});

interface ButtonProps {
  login: (values: any) => void;
}
const GoogleButton = ({login}: ButtonProps) => {
  const loginWithGoogle = () => {
    GoogleSignin.signIn().then(
      (response) => {
        if (response.isCancelled) {
          console.log('Login cancelled');
        } else {
          GoogleSignin.getTokens().then((data) => {
            login(data.accessToken.toString());
          });
        }
      },
      (error) => {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          console.log('User Cancelled the Login Flow');
        } else if (error.code === statusCodes.IN_PROGRESS) {
          console.log('Signing In');
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          console.log('Play Services Not Available or Outdated');
        } else {
          console.log('Some Other Error Happened');
        }
      },
    );
  };

  return (
    <TouchableOpacity onPress={() => loginWithGoogle()}>
      <Google width={70} height={70} />
    </TouchableOpacity>
  );
};

export default GoogleButton;
