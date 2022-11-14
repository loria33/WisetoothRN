import React from 'react';
import { View, StyleSheet, Text, Keyboard, ScrollView } from 'react-native';
import { Colors } from '../styles/StyleSheet';
import { Formik } from 'formik';
import Input from './Input';
import I18n from '../l18n/I18n';
// @ts-ignore
import Search from '../../assets/images/search.svg';
// @ts-ignore
import Close from '../../assets/images/close.svg';
import { TouchableOpacity } from 'react-native-gesture-handler';
import moment from 'moment';
import { Icon } from 'react-native-elements';
import { checkIfNumberKeyPressed } from '../utils/helpers';

interface Inputs {
  toothNum: any;
  patientName: any;
  day: any;
  month: any;
  year: any;
  serialNum: any
}

interface SearchImplantProps {
  onSearch: (values: any, flag: boolean) => void;
  getList: () => void;
  isSearchDone: boolean;
}
const validateDate = (values: any) => {
  const { day, month, year } = values;
  let isValid = true;
  let date = '';
  if (day || month || year) {
    if (!moment(moment(new Date(`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`)).format("YYYY-MM-DD"), "YYYY-MM-DD", true)
      .isValid()) {
      isValid = false;
    } else {
      isValid = true;
      date = moment(new Date(`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`)).format("YYYY-MM-DD");
    }
  } else {
    isValid = true;
  }
  return { isValid, date }
}
const SearchImplant = ({ onSearch, isSearchDone, getList }: SearchImplantProps) => {
  const input: Inputs = { toothNum: undefined, patientName: undefined, day: undefined, month: undefined, year: undefined, serialNum: undefined };
  let dateError = '';
  return (
    <Formik
      initialValues={{ toothNum: '', patientName: '', day: '', month: '', year: '', serialNum: '' }}
      onSubmit={(values) => {
        Keyboard.dismiss();
        const { toothNum, patientName, serialNum } = values;
        const { date, isValid } = validateDate(values);
        if (isValid) {
          let isToSearchByName;
          if (patientName && patientName.length > 2 && !toothNum && !serialNum && !date) {
            isToSearchByName = true;

          } else {
            isToSearchByName = false;
          }
          onSearch({
            patientName,
            toothNum,
            serialNum,
            date
          }, isToSearchByName);
          dateError = '';
        } else {
          dateError = I18n.t('invalidDate');
        }
      }}
    >
      {({
        setFieldValue,
        setFieldTouched,
        touched,
        values,
        handleSubmit,
        resetForm
      }) => (
          <View style={styles.container}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="always"
            >
              <View style={styles.header}>
                <Text style={styles.title}>{I18n.t('searchHeader')}</Text>
                {/* <Text style={styles.title}>{I18n.t('searchSubHeader')}</Text> */}
              </View>
              <View style={styles.row}>
                <View style={styles.flex}>
                  <Input
                    reference={c => input.toothNum = c}
                    onSubmitEditing={() => {
                      input.patientName.focus();
                    }}
                    autoCorrect={false}
                    placeholder={I18n.t('toothNumber')}
                    returnKeyType="next"
                    ChangeText={(text) => {
                      setFieldValue('toothNum', text);
                      dateError = '';
                    }}
                    touched={touched.toothNum}
                    onBlur={() => {
                      if (values.toothNum !== '') setFieldTouched('toothNum', true);
                    }}
                    autoCapitalize="none"
                    blurOnSubmit={false}
                    hideErrorMsg={true}
                    hideIcon={true}
                    value={values.toothNum}
                  />
                </View>
                <View style={[styles.flex, { marginLeft: 15 }]}>
                  <Input
                    reference={c => input.patientName = c}
                    onSubmitEditing={() => {
                      input.day.focus();
                    }}
                    autoCorrect={false}
                    placeholder={I18n.t('patientName')}
                    returnKeyType="next"
                    ChangeText={(text) => {
                      setFieldValue('patientName', text);
                      dateError = '';
                    }}
                    touched={touched.patientName}
                    onBlur={() => {
                      if (values.patientName !== '') setFieldTouched('patientName', true);
                    }}
                    autoCapitalize="none"
                    blurOnSubmit={false}
                    hideErrorMsg={true}
                    hideIcon={true}
                    value={values.patientName}
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.inputRow}>
                  <Input
                    reference={c => input.day = c}
                    onSubmitEditing={() => {
                      input.month.focus();
                    }}
                    autoCorrect={false}
                    placeholder={I18n.t('day')}
                    returnKeyType="next"
                    ChangeText={(text) => {
                      if (checkIfNumberKeyPressed(text)) {
                        setFieldValue('day', text);
                        dateError = '';
                      }
                    }}
                    touched={touched.day}
                    onBlur={() => {
                      if (values.day !== '') setFieldTouched('day', true);
                    }}
                    autoCapitalize="none"
                    blurOnSubmit={false}
                    hideErrorMsg={true}
                    hideIcon={true}
                    value={values.day}
                  />
                  <View style={styles.dateDivider} />
                </View>
                <View style={styles.inputRow}>
                  <Input
                    reference={c => input.month = c}
                    onSubmitEditing={() => {
                      input.year.focus();
                    }}
                    autoCorrect={false}
                    placeholder={I18n.t('month')}
                    returnKeyType="next"
                    ChangeText={(text) => {
                      if (checkIfNumberKeyPressed(text)) {
                        setFieldValue('month', text);
                        dateError = '';
                      }
                    }}
                    touched={touched.month}
                    onBlur={() => {
                      if (values.month !== '') setFieldTouched('month', true);
                    }}
                    autoCapitalize="none"
                    blurOnSubmit={false}
                    hideErrorMsg={true}
                    hideIcon={true}
                    value={values.month}
                  />
                  <View style={styles.dateDivider} />
                </View>
                <View style={styles.inputRow}>
                  <Input
                    reference={c => input.year = c}
                    onSubmitEditing={() => {
                      input.serialNum.focus();
                    }}
                    autoCorrect={false}
                    placeholder={I18n.t('year')}
                    returnKeyType="next"
                    ChangeText={(text) => {
                      if (checkIfNumberKeyPressed(text)) {
                        setFieldValue('year', text);
                        dateError = '';
                      }
                    }}
                    touched={touched.year}
                    onBlur={() => {
                      if (values.year !== '') setFieldTouched('year', true);
                    }}
                    autoCapitalize="none"
                    blurOnSubmit={false}
                    hideErrorMsg={true}
                    hideIcon={true}
                    value={values.year}
                  />
                </View>
              </View>
              <View style={styles.row}>

                <View style={styles.flex}>
                  <Input
                    reference={c => input.serialNum = c}
                    onSubmitEditing={handleSubmit}
                    autoCorrect={false}
                    placeholder={I18n.t('serialNumber')}
                    returnKeyType="go"
                    ChangeText={(text) => {
                      setFieldValue('serialNum', text);
                    }}
                    touched={touched.serialNum}
                    onBlur={() => {
                      if (values.serialNum !== '') setFieldTouched('serialNum', true);
                    }}
                    autoCapitalize="none"
                    blurOnSubmit={false}
                    hideErrorMsg={true}
                    hideIcon={true}
                    value={values.serialNum}
                  />
                </View>
                <View style={{
                  flexDirection: 'row',
                  flex: 1,
                  justifyContent: 'flex-start',
                  marginLeft: 22
                }}>
                  <TouchableOpacity onPress={() => handleSubmit()} style={styles.iconContainer}>
                    <Icon name="search" color={Colors.whiteColor} />
                  </TouchableOpacity>
                  {isSearchDone ?
                    <TouchableOpacity onPress={() => {
                      Keyboard.dismiss();
                      resetForm({});
                      getList();
                    }} style={[styles.iconContainer, { marginLeft: 10 }]}>
                      <Icon name="close" color={Colors.whiteColor} />
                    </TouchableOpacity>
                    : <View />}
                </View>
              </View>
            </ScrollView>
            <Text style={[styles.error, { marginLeft: 15 }]}>
              {dateError}
            </Text>
          </View>
        )}
    </Formik>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: '8%',
    paddingRight: '8%',
  },
  header: {
    paddingTop:20,
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingLeft: '5%',
    paddingRight: '8%',
    marginBottom: 10,
  },
  title: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    textAlign: 'left',
    color: Colors.blueColor,
    lineHeight: 18
  },
  inputRow: {
    flex: 1.5,
    flexDirection: 'row',
    position: 'relative'
  },
  flex: {
    flex: 1,
  },
  dateDivider: {
    backgroundColor: Colors.themeColor,
    flex: 0.1,
    transform: [{ rotate: '30deg' }],
    marginBottom: 28,
    marginLeft: 10,
  },
  error: {
    color: '#eb4859',
    fontSize: 12,
  },
  iconContainer: {
    backgroundColor: Colors.themeColor,
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  }
});

export default SearchImplant;
