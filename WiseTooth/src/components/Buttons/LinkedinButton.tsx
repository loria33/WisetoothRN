import React from 'react';
import { TouchableOpacity } from 'react-native';
// @ts-ignore
import Linkedin from '../../../assets/images/linkedin.svg';
import LinkedInModal from 'react-native-linkedin';
import { linkedinInfo } from '../../config/keys';

const linkedRef = React.createRef<LinkedInModal>();

interface ButtonProps {
  login: (values: any) => void;
}
const LinkedinButton = ({ login }: ButtonProps) => {
  return (
    <LinkedInModal
      ref={linkedRef}
      clientID={linkedinInfo.clientID}
      clientSecret={linkedinInfo.clientSecret}
      redirectUri={linkedinInfo.redirectUri}
      renderButton={() => (
        <TouchableOpacity
          onPress={() => {
            linkedRef &&
              linkedRef.current
                .logoutAsync()
                .then(() => linkedRef.current.open());
          }}>
          <Linkedin width={70} height={70} />
        </TouchableOpacity>
      )}
      onSuccess={(token) => login(token.access_token)}
      onError={(error) => console.log(error)}
    />
  );
};

export default LinkedinButton;
