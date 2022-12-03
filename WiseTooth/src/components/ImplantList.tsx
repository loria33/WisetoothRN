import React from 'react';
import { View, StyleSheet, Text, SectionList, Dimensions } from 'react-native';
import { Colors, fontRatio } from '../styles/StyleSheet';
import I18n from '../l18n/I18n';
// @ts-ignore
import Search from '../../assets/images/search.svg';
// @ts-ignore
import Failed from '../../assets/images/failed.svg';
// @ts-ignore
import ReportAFailure from '../../assets/images/reportAFailure.svg';
// @ts-ignore
import Tooth from '../../assets/images/tooth.svg';
// @ts-ignore
import Serial from '../../assets/images/serial.svg';
import moment from 'moment';
import { TouchableOpacity } from 'react-native-gesture-handler';

const dim = Dimensions.get('window');

interface InstallsProps {
  Implant: any;
  toothNum: any;
}
interface IconTextContainerProps {
  installs: any;
  field: any;
}
let innerTouchable = false;


const IconTextContainer = ({ installs, field }: IconTextContainerProps) => (
  installs.slice(0, 2).map((item: InstallsProps, index: any) => (
    field === 'serial' ?
      <View style={styles.iconTextRowContainer} key={index}>
        <Serial />
        <Text style={[styles.bodyText, styles.iconText]}>{item.Implant && item.Implant.ImplantLabel ? item.Implant.ImplantLabel.label : '--'}</Text>
      </View> :
      <View style={[styles.iconTextRowContainer, { position: 'relative' }]} key={index}>
        <View style={{ position: 'absolute', left: '30%' }}>
          <Tooth />
        </View>
        <Text style={[styles.bodyText, styles.iconText, { textAlign: 'center', paddingLeft: 10 }]}>{item.toothNum || '--'}</Text>
      </View>
  ))
)

const Header = () => (
  <View style={{ flexDirection:'row',width:'100%'}}>
  <View style={styles.contentHeader}>
    <View style={{ flex: 0.9 }} >
      <Text style={[styles.headrText, { textAlign: 'left' }]}>{I18n.t('date')}</Text>
    </View>
    <View style={styles.flex} >
      <Text style={styles.headrText}>{I18n.t('serialNumber')}</Text>
    </View>
    <View style={styles.flex} >
      <Text style={styles.headrText}>{I18n.t('toothNumber')}</Text>
    </View>
   
  </View>
   <View style={styles.flex} >
      <Text style={styles.headrText}>{I18n.t('reportAFailure')}</Text>
    </View>
  </View>
);

const ImplantList = ({ data, navigation }: any) => {
  const renderItem = ({ item }: any) => (
    <View style={{ flexDirection:'row',width:'100%'}}>
    <TouchableOpacity style={[styles.contentBody, item.isFailure ? styles.failureContentBody : styles.successContentBody]}
      key={item.id} onPress={() => navigateToPatientInformationView(item)}>
      <View style={{ flex: 0.9, alignItems: 'center', flexDirection: 'row' }}><Text style={styles.bodyText}>{moment(item.date).format('DD/MM/YY')}</Text></View>
      <View style={styles.iconTextColumnContainer}>
        <IconTextContainer installs={item.Installs} field="serial" />
      </View>
      <View style={styles.iconTextColumnContainer}>
        <IconTextContainer installs={item.Installs} field="tooth" />
      </View>
      {item.Installs.length > 2 && <View style={styles.moreContainer}><Text style={styles.moreText}>{I18n.t('more')}</Text></View>
      }
      </TouchableOpacity>
      {item.isFailure ? 
        <TouchableOpacity onPress={() => navigateToPatientInformationView(item)}
        style={[styles.failureBody,styles.failureWrapper,{width:dim.width*0.2, justifyContent:'center',alignItems: 'center',backgroundColor:'rgba(0, 204, 212, 0.3)', flexDirection: 'row',marginLeft:10}]}>
          
            <View style={{justifyContent: 'center',alignContent:'center'}} >
            <Failed width={7} height={10} /> 
           </View>
         </TouchableOpacity>
     
      :
     <TouchableOpacity onPress={() => navigateToReportAFailureView(item)} 
     style={[styles.failureBody,styles.failureWrapper,{width:dim.width*0.2, justifyContent:'center',alignItems: 'center', flexDirection: 'row',marginLeft:10}]}>
       
         <View style={{justifyContent: 'center',alignContent:'center'}} >
           <ReportAFailure width={25} height={25} />
        </View>
      </TouchableOpacity>}
    </View>
  );
  <View style={styles.iconContainer}>
</View>


  const navigateToPatientInformationView = (item: any) => {
    if(!innerTouchable){
      navigation.navigate('PatientInformation', { item });
    } else {
      innerTouchable = false;
    }
  }

  const navigateToReportAFailureView = (item: any) => {
    if (item.Installs.length > 1) {
      navigateToPatientInformationView(item);
    } else {
      innerTouchable = true;
      navigation.navigate('ReportAFailure', {
        date: item.date,
        id: item.Installs[0].id,
        toothNum: item.Installs[0].toothNum,
        serialNum: item.Installs[0].Implant && item.Installs[0].Implant.ImplantLabel &&
                    item.Installs[0].Implant.ImplantLabel.label,
        nextStageNumber: '1',
        manufacturerModel: item.Installs[0].Implant && item.Installs[0].Implant.ImplantLabel &&
        item.Installs[0].Implant.ImplantLabel.ManufacturerModel,
      });
    }
  }

  return (
    <View style={styles.container}>
      <SectionList
        sections={data}
        keyExtractor={(item, index) => item + index}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.column}>
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
            </View>
            <View style={styles.content}>
              <Header />
            </View>
          </View>
        )}
      />
      {data.length === 0 &&
        <View>
          <Text style={styles.title}>{I18n.t('noDataMsg')}</Text>
        </View>
      }
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingLeft: '8%',
    paddingRight: '8%',
  },
  column: {
    flexDirection: 'column',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  title: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    color: Colors.themeColor,
  },
  content: {
    flexDirection: 'column',
  },
  contentHeader: {
    flexDirection: 'row',
    paddingLeft: 10,
    marginBottom: 10,
    width:Dimensions.get('window').width*0.6,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headrText: {
    fontFamily: 'System',
    fontSize: fontRatio(12),
    fontWeight: '300',
    fontStyle: 'normal',
    textAlign: 'center',
    color: Colors.themeColor,
    flex: 1,
  },
  bodyText: {
    fontFamily: 'System',
    fontSize: fontRatio(14),
    fontWeight: '300',
    fontStyle: 'normal',
    color: Colors.blueColor,
    textAlign: 'left',
    flex: 1,
  },
  iconText: {
    paddingLeft: '4%',
    textAlign: 'left',
    fontSize: fontRatio(12),
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center'
  },
  failureWrapper:{
    backgroundColor: Colors.lightGrayColor,
    elevation: 0.5,
  },

  successContentBody: {
    backgroundColor: Colors.lightGrayColor,
    elevation: 0.5,
    width:Dimensions.get('window').width*0.6
  },
  failureContentBody: {
    backgroundColor: 'rgba(0, 204, 212, 0.3)',
    width:Dimensions.get('window').width*0.6
  },
  contentBody: {
    flexDirection: 'row',
    borderRadius: 15,
    alignItems: 'center',
    paddingLeft: 10,
    marginBottom: 10,
    height: 65,
    position: 'relative',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  failureBody: {
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 10,
    height: 65,
    position: 'relative',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  list: {
    flex: 1,
  },
  moreContainer: {
    position: 'absolute',
    left: '44%',
    bottom: 1,
  },
  moreText: {
    color: Colors.themeColor,
    fontSize: 10,
    fontFamily: 'System',
  },
  iconTextColumnContainer: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
  },
  iconTextRowContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  flex: { flex: 1 }
});

export default ImplantList;
