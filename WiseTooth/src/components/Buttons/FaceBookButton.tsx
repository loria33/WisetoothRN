import React from 'react';
import { TouchableOpacity } from 'react-native';
// @ts-ignore
import Facebook from '../../../assets/images/facebook.svg';
// @ts-ignore
import { AccessToken, LoginManager } from 'react-native-fbsdk';

interface ButtonProps {
  login: (values: any) => void;
}
const FaceBookButton = ({ login }: ButtonProps) => {
  const loginWithFacebook = () => {
    // LoginManager.logOut();
    // LoginManager.logInWithPermissions(['public_profile', 'email']).then(
    //   (response: { isCancelled: any; }) => {
    //     if (response.isCancelled) {
    //     } else {
    //       AccessToken.getCurrentAccessToken().then((data: { accessToken: { toString: () => any; }; }) => {
    //         login(data.accessToken.toString());
    //       });
    //     }
    //   },
    //   (error: string) => {
    //     console.log('Login fail with error: ' + error);
    //   },
    // );
  };

  return (
    <TouchableOpacity onPress={() => loginWithFacebook()}>
      <Facebook width={70} height={70} />
    </TouchableOpacity>
  );
};

export default FaceBookButton;
