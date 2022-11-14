import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../styles/StyleSheet';
import LinearGradient from 'react-native-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
import I18n from '../../l18n/I18n';
import * as _ from 'lodash';

interface FooterProps {
  back: () => void;
  next?: (pageName: any) => void;
  nextPageName?: any;
  isFailure?: boolean;
  pageNum: number;
  navigation?: any;
  item?: any;
}
const implantDetailsViews = [
  'PatientInformation',
  'SurgeryInformationPlacement',
  'SutureRemovalStageInformation',
  'SutureRemovalStage2Information',
  'ProstheticStepsInformation'
]
const renderFields = (nav: any, item: any, pageNum: number) => {
  const fields = [];
  const max = getMax(item);
  for (let i = 0; i < max; i++) {
    fields.push(
      <TouchableOpacity key={i} style={{
        width: 20,
        height: 20,
        justifyContent: 'center'
      }}
        onPress={() => { nav.navigate(implantDetailsViews[i], { item }) }}
      >
        <View style={[styles.oval, {
          marginRight: i < max - 1 ? 8 : 0,
          backgroundColor: pageNum === i ? Colors.blueColor : 'transparent'
        }]} />
      </TouchableOpacity>
    );
  }
  return fields;
}

const getMax = (item: any) => {
  const prostheticStepsInformation = item.Installs[0] &&
    item.Installs[0].report && item.Installs[0].report.answers.prostheticStepsInformation;
  return _.isEmpty(prostheticStepsInformation) ? 4 : 5;
}
const Footer = ({ back, next, nextPageName, isFailure, pageNum, navigation, item }: FooterProps) => (

  <LinearGradient
    colors={[Colors.whiteColor, '#e8e8e8']}
    style={styles.linearGradient}>
    <View style={styles.footer}>
      <TouchableOpacity onPress={back} style={styles.footerContent}><Text style={styles.back}>{I18n.t('back')}</Text></TouchableOpacity>
      {isFailure && pageNum &&
        <View style={styles.column}>
          <Text style={styles.pageNum}>{pageNum + `/${getMax(item)}`}</Text>
          <View style={{ flexDirection: 'row', marginTop: 4 }}>
            {renderFields(navigation, item, pageNum - 1)}
          </View>
        </View>
      }
      {isFailure && nextPageName ? <TouchableOpacity style={styles.footerContent} onPress={() => next && next(nextPageName)}>
        <Text style={styles.back}>{I18n.t('next')}</Text>
      </TouchableOpacity> : <View style={{ width: 20 }} />
      }
    </View>
  </LinearGradient>
)

const styles = StyleSheet.create({
  linearGradient: {
    //flex: 1,
    shadowColor: 'rgba(0, 0, 0, 0.16)',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.23,
    shadowRadius: 15,
    elevation: 4,
    height: 70
  },
  footer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15
  },
  back: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '300',
    fontStyle: 'normal',
    textAlign: 'center',
    color: Colors.blueColor,
  },
  footerContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageNum: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '300',
    fontStyle: 'normal',
    textAlign: 'center',
    color: Colors.blueColor,
  },
  oval: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: Colors.blueColor,
    borderRadius: 5,
    backgroundColor: 'transparent'
  },
  column: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center'
  }
});

export default Footer;