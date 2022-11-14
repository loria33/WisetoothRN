import React from 'react';
import { TextInput, View, StyleSheet, Text, TextInputProps } from 'react-native';
import { Icon } from 'react-native-elements';
// @ts-ignore
import NextOn from '../../assets/images/nextOn.svg';
import { Colors, fontRatio } from '../styles/StyleSheet';
import { FormikErrors, FormikTouched } from 'formik';

const getColor = (
  errorMessage: string | undefined,
  touched: boolean | undefined,
) => (errorMessage && touched ? '#eb4859' : Colors.themeColor);

interface InputPropsWithSVG {
  icon: string;
  iconType: string;
  SvgIcon: any;
}

interface InputPropsBasics
  extends Partial<TextInputProps>,
  Partial<InputPropsWithSVG> {
  errorMessage?: string | string[] | FormikErrors<any> | FormikErrors<any>[] | undefined;
  ChangeText: (text: string) => void;
  onSubmitEditing?: () => void;
  touched?: boolean | FormikTouched<any> | FormikTouched<any>[] | undefined;
  // optional
  reference: (arg: any) => void;
  hideErrorMsg?: boolean;
  showHidePress?: () => void;
  hideIcon?: boolean;
  width?: string;
}

class Input extends React.Component<InputPropsBasics, {}> {
  render() {
    const {
      errorMessage,
      ChangeText,
      touched,
      reference,
      icon,
      iconType,
      hideErrorMsg,
      SvgIcon,
      hideIcon,
      width,
      style,
      ...otherProps
    } = this.props;
    return (
      <View style={[styles.input, style ? style : {}]}>
        <View
          style={[
            styles.inputWrap,
            {
              borderColor: getColor(errorMessage, touched),
              justifyContent: hideIcon ? 'center' : 'flex-start'
            },
          ]}>
          {SvgIcon ? (
            <SvgIcon
              width={20}
              height={20}
              style={{ color: getColor(errorMessage, touched) }}
            />
          ) : !hideIcon && (
            <Icon
              name={icon || ''}
              type={iconType}
              size={20}
              color={getColor(errorMessage, touched)}
            />
          )}
          <TextInput
            {...otherProps}
            ref={(input) => {
              reference(input);
            }}
            underlineColorAndroid="transparent"
            onChangeText={(text) => {
              ChangeText(text);
            }}
            placeholderTextColor="rgba(0, 65, 124, 0.6)"
            textContentType={'oneTimeCode'}
            style={styles.textInput}
          />

        </View>
        <View style={styles.errorContainer}>
          {touched && errorMessage && !hideErrorMsg && (
            <Text style={styles.error}>{errorMessage}</Text>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    height: 30,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingTop: 0,
    paddingBottom: 8,
    width: '80%',
    color: Colors.blueColor,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Roboto',
    fontWeight: '300',
    fontStyle: 'normal',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#9B9B9B',
    borderBottomWidth: 1,
  },
  errorText: {
    color: '#FF0000',
    fontSize: fontRatio(13),
  },
  input: {
    height: 65
  },
  error: {
    color: '#eb4859',
    fontSize: 12,
    width: "100%"
  },
  errorContainer: {
    paddingTop: 10,
    width: '100%',
  },
});

export default Input;
