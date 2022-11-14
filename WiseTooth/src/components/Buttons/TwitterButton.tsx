import React from 'react';
import { TouchableOpacity,NativeModules} from 'react-native';
// @ts-ignore
import Twitter from '../../../assets/images/twitter.svg';
import { twitterKeys } from '../../config/keys';

const { RNTwitterSignIn } = NativeModules

interface ButtonProps {
  login: (authToken: any, authTokenSecret: any, userID: any) => void;
}
RNTwitterSignIn.init(twitterKeys.consumerKey, twitterKeys.consumerSecret)

const TwitterButton = ({ login }: ButtonProps) => {
  const loginWithTwitter = () => {
    RNTwitterSignIn.logIn().then(
      (data: { authToken: any; authTokenSecret: any; userID: any; }) => {
        const { authToken, authTokenSecret, userID } = data;
        login(authToken, authTokenSecret, userID);
      },
      (error: string) => {
        console.log('Login fail with error: ' + error);
      },
    );
  };
  return (
    <TouchableOpacity onPress={() => loginWithTwitter()}>
      <Twitter width={70} height={70} />
    </TouchableOpacity>
  );
};

export default TwitterButton;
