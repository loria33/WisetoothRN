import React from 'react';
import { Alert } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerContentComponentProps,
  DrawerContentOptions,
} from '@react-navigation/drawer';
import I18n from '../l18n/I18n';
import { connect } from 'react-redux';
import * as userActions from '../redux/actions/user';

interface DrawerContentProps extends DrawerContentComponentProps<DrawerContentOptions> {
  logout: () => void;
}

class DrawerContent extends React.Component<DrawerContentProps, {}> {

  logoutConfirmation = () => {
    Alert.alert('', I18n.t('logOutMsg'), [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          this.props.logout();
        },
      },
    ]);
  };

  render() {
    const props = this.props;
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItem
          label='Implants Statistics'
          onPress={() => props.navigation.navigate('Implants Statistics')}
        />
        <DrawerItem
          label='Implants List'
          onPress={() => props.navigation.navigate('Implants List')}
        />
        <DrawerItem
          label='Create Implant'
          onPress={() => { props.navigation.navigate("Create Implant",  { screen: 'ScanImplant',  params: {implants: []} }) }}
        />
        <DrawerItem
          label={I18n.t('logOut')}
          onPress={this.logoutConfirmation}
        />
      </DrawerContentScrollView>
    );
  }
}

const mapStateToProps = () => ({});
export default connect(mapStateToProps, { logout: userActions.logout })(DrawerContent);
