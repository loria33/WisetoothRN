import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { Colors } from '../../styles/StyleSheet'

interface AppButtonProps {
  loading: boolean;
  title: string;
  submit: (values: any) => void;
}
const AppButton = ({ loading, title, submit }: AppButtonProps) => {
  return (
    <Button
      loading={loading}
      title={title}
      buttonStyle={styles.button}
      titleStyle={styles.btnText}
      onPress={submit}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.lightGreenColor,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginBottom: 25,
  },
  btnText: {
    color: Colors.whiteColor,
    fontSize: 14,
    fontWeight: "bold",
  },
});
export default AppButton;
