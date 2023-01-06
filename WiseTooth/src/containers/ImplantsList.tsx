import React,{Fragment} from 'react';
import { View, ScrollView, ActivityIndicator, Text, StyleSheet, SafeAreaView,Platform } from 'react-native';
import Header from '../components/Header';
import I18n from '../l18n/I18n';
import { StackNavigationProp } from '@react-navigation/stack';
import SearchImplant from '../components/SearchImplant';
import ImplantList from '../components/ImplantList';
import { connect } from 'react-redux';
import * as visitActions from '../redux/actions/visit';
import { Colors } from '../styles/StyleSheet'
import LinearGradient from 'react-native-linear-gradient';
// @ts-ignore
import Add from '../../assets/images/add.svg';
import { TouchableOpacity } from 'react-native-gesture-handler';
import _ from 'lodash';
import { objToQueryString } from '../utils/helpers';
import { getStatusBarHeight} from 'react-native-status-bar-height';

interface ImplantsListProps {
  navigation: StackNavigationProp<{
    "Create Implant": {};
  }, "Create Implant">;
  getVisitList: () => void;
  setListFlag: () => void;
  searchOnVisitList: (queryObj: any) => void;
  visitsList: any;
  isLoading: boolean;
  visitListError: any;
  isSearchDone: boolean;
  visitsListWithoutFilter: any;
}

interface StateProps {
  filteredVisitsList: any
}

class ImplantsList extends React.Component<ImplantsListProps, StateProps> {
  focusListener: any;
  scrollView: any;
  constructor(props: Readonly<ImplantsListProps>) {
    super(props);
    this.state = {
      filteredVisitsList: undefined
    }
    this.goBack = this.goBack.bind(this);
    this.navigateToCreateImplantView = this.navigateToCreateImplantView.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.formatData = this.formatData.bind(this);
    this.formatFailureData = this.formatFailureData.bind(this);
  }

  componentDidMount() {
    this.props.getVisitList();
    this.focusListener = this.props.navigation.addListener('focus', this.scrollToTop)
  }

  componentWillUnmount() {
    this.focusListener();
  }

  scrollToTop = () => {
    this.scrollView &&
      this.scrollView.scrollTo && this.scrollView.scrollTo({ x: 0, y: 0, animated: false })
  }

  onSearch = (values: any, searchByName: boolean) => {
    this.setState({filteredVisitsList: undefined})
    if (searchByName) {
      const filteredVisitsList = _.cloneDeep(this.props.visitsListWithoutFilter);
      let { lastWeekVisits, lastMonthVisits, earlier } = filteredVisitsList;
      const patientName = values.patientName.toString().toLowerCase();
      const filteredLastWeekVisits = lastWeekVisits.filter((item: any) =>
        item.Patient && item.Patient.name.toLowerCase().indexOf(patientName) !== -1);
      const filteredLastMonthVisits = lastMonthVisits.filter((item: any) =>
        item.Patient && item.Patient.name.toLowerCase().indexOf(patientName) !== -1);
      const filteredEarlierList = earlier.filter((item: any) =>
        item.Patient && item.Patient.name.toLowerCase().indexOf(patientName) !== -1);

      filteredVisitsList.lastWeekVisits = filteredLastWeekVisits ;
      filteredVisitsList.lastMonthVisits = filteredLastMonthVisits;
      filteredVisitsList.earlier = filteredEarlierList;
      this.setState({filteredVisitsList})
      this.props.setListFlag();
    } else {
      const { searchOnVisitList, getVisitList } = this.props;
      objToQueryString(values) ? searchOnVisitList(objToQueryString(values)) : getVisitList();
    }
  }

  navigateToCreateImplantView = () => {
    this.props.navigation.navigate("Create Implant",  { screen: 'ScanImplant',  params: {implants: []} });
  }

  goBack = () => {
    this.props.navigation.goBack();
  }

  formatFailureData = (list: any) => {
     //console.log({list})
     const failedList: { date: any; Patient: any; Installs: any[]; isFailure: boolean; }[] = [];
    const installedList: { date: any; Patient: any; Installs: any[]; isFailure: boolean; }[] = [];

    list.map((item: any) => {
      const failuresList = item.Installs.filter((install: any) => install.report && install.report.questionaireType === "failure");
      const installList = item.Installs.filter((install: any) => !install.report)
      failuresList.map((install: any) => {
        failedList.push({
          date: item.date,
          Patient: item.Patient,
          Installs: [install],
          isFailure: true,
        })
      })
      if (installList.length > 0) {
        installedList.push({
          date: item.date,
          Patient: item.Patient,
          Installs: installList,
          isFailure: false,
        })
      }
    })
    return [...installedList, ...failedList];
  }

  formatData = (list: any) => {
    const sectionList = [];
    if (this.formatFailureData(list.lastWeekVisits).length > 0) {
      sectionList.push({
        title: I18n.t('lastWeek'),
        data: this.formatFailureData(list.lastWeekVisits)
      });
    }

    if (this.formatFailureData(list.lastMonthVisits).length > 0) {
      sectionList.push({
        title: I18n.t('lastMonth'),
        data: this.formatFailureData(list.lastMonthVisits)
      });
    }

    if (list.earlier && this.formatFailureData(list.earlier).length > 0) {
      sectionList.push({
        title: I18n.t('earlier'),
        data: this.formatFailureData(list.earlier)
      });
    }

    return sectionList;
  }

  getList = () => {
    this.setState({ filteredVisitsList: undefined }, () => this.props.getVisitList());
  }

  render() {
    const { navigation, visitsList, isLoading, visitListError, isSearchDone } = this.props;
    return (
      <Fragment>
      <SafeAreaView style={styles.saveAreaBackgrounColor} />
      <SafeAreaView style={styles.saveAreaView}>
      <View style={{ flex: 1 }}>
        <Header title={I18n.t('implantsList')} navigation={navigation}  style={{ paddingBottom: 10 }} />
        <ScrollView
          ref={ref => this.scrollView = ref}
          keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>
          <SearchImplant onSearch={this.onSearch} isSearchDone={isSearchDone} getList={this.getList} />
          {isLoading ?
            <View style={styles.loader}>
              <ActivityIndicator size="large" color={Colors.themeColor} />
            </View>
            : visitListError ?
              <View style={styles.errorContainer}>
                <Text style={styles.text}>{visitListError}</Text>
              </View>
              : (this.state.filteredVisitsList || visitsList) && <ImplantList data={this.formatData(this.state.filteredVisitsList || visitsList)} navigation={navigation} />}
        </ScrollView>
        <View style={{ height: 70 }}>
          <LinearGradient
            colors={[Colors.whiteColor, '#e8e8e8']}
            style={styles.linearGradient}>
              <View style={styles.footer}>
                {/* <TouchableOpacity onPress={this.goBack} style={[styles.footerContent, { paddingLeft: 30, alignItems: 'center' }]}><Text style={styles.back}>{I18n.t('back')}</Text></TouchableOpacity>
                 */}
                <TouchableOpacity onPress={this.navigateToCreateImplantView} style={styles.footerContent}><Add style={{marginTop: 10 }} width={112} height={83} /></TouchableOpacity>
              </View>
          </LinearGradient>
        </View>
      </View>
      </SafeAreaView>
      </Fragment>
    );
  }
}
const styles = StyleSheet.create({
  saveAreaBackgrounColor: {
    flex: 0,
    backgroundColor: Colors.themeColor,
  },
  saveAreaView: {
      flex: 1,
      backgroundColor: '#e8e8e8',
      paddingTop: Platform.OS === 'android' ?  getStatusBarHeight() : 0 ,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 64,
  },
  loader: {
    marginTop: 64,
  },
  linearGradient: {
    flex: 1,
    shadowColor: 'rgba(0, 0, 0, 0.16)',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  footer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent:'flex-end',
    alignItems: 'center'
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
    alignItems: "center",
  },
  text: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    color: Colors.themeColor,
  },
});
const mapStateToProps = (state: {
  visit: {
    visitsList: any; isLoading: any;
    visitListError: any; isSearchDone: boolean;
    visitsListWithoutFilter: any
  };
}) => ({
  visitsList: state.visit.visitsList,
  isLoading: state.visit.isLoading,
  visitListError: state.visit.visitListError,
  isSearchDone: state.visit.isSearchDone,
  visitsListWithoutFilter: state.visit.visitsListWithoutFilter,
});
export default connect(mapStateToProps, {
  getVisitList: visitActions.getVisitList,
  searchOnVisitList: visitActions.searchOnVisitList,
  setListFlag: visitActions.setListFlag
})(ImplantsList);