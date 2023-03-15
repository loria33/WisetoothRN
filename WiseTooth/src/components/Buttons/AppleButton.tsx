import React from 'react';
import {TouchableOpacity} from 'react-native';
// @ts-ignore
import Apple from '../../../assets/images/apple.svg';

import auth from '@react-native-firebase/auth';
import {
  appleAuth,
} from '@invertase/react-native-apple-authentication';


interface ButtonProps {
  login: (values: any) => void;
}
const AppleButton = ({login}: ButtonProps) => {
  const loginWithApple= async () => {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    if (!appleAuthRequestResponse.identityToken) {
      throw 'Apple login failed - no identify token returned';
    }

    const {identityToken, nonce} = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce,
    );
      debugger;
    const aa = await auth().signInWithCredential(appleCredential);
   console.log({aa});
   
  };

  return (
    <TouchableOpacity onPress={() => loginWithApple()} style={{marginBottom:10,paddingLeft:5}}>
      <Apple width={40} height={40} />
    </TouchableOpacity>
  );
};

export default AppleButton;
