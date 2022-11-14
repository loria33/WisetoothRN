import React from 'react';
import { View, StyleSheet } from 'react-native';
import GoogleButton from '../components/Buttons/GoogleButton';
// @ts-ignore
import Logo from '../../assets/images/logo.svg';
// @ts-ignore
import GDrive from "react-native-google-drive-api-wrapper";

class Backup extends React.Component {

  constructor(props: any) {
    super(props);
  }

  googleSignInCompleted(accessToken: string) {
    GDrive.setAccessToken(accessToken);
    GDrive.init();
  }

  render() {
    return (
      <View style={styles.container}>
        <GoogleButton login={this.googleSignInCompleted} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});


export default Backup;
