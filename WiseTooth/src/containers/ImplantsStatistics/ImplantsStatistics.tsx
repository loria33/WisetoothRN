import React, { Fragment } from 'react';
import { ScrollView, StyleSheet, View, Text, Dimensions, ActivityIndicator, SafeAreaView, Platform } from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { Colors, fontRatio } from '../../styles/StyleSheet'
import LinearGradient from 'react-native-linear-gradient';
// @ts-ignore
import Add from '../../../assets/images/add.svg';
// @ts-ignore
import Serial from '../../../assets/images/serial.svg';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import * as visitActions from '../../redux/actions/visit';
import Header from './Header';
import AreaChart from './AreaChart';
import I18n from '../../l18n/I18n';
import * as _ from 'lodash';
import { objToQueryString } from '../../utils/helpers';
import { getStatusBarHeight} from 'react-native-status-bar-height';
interface ImplantsStatisticstProps {
  getImplantStatistics: (values: any, navigateToStatisticsView: boolean) => void;
  name: string;
  route: any;
  isLoading: boolean;
  statisticsError: string;
  statisticsList: any;
  navigation: CompositeNavigationProp<
  StackNavigationProp<{
    "Create Implant": {};
  }, "Create Implant">,
  StackNavigationProp<{
    "Implants List": undefined;
  }, "Implants List">
  >
}

interface StateProps {
  isSuccessSelected: boolean;
  isPersonalSelected: boolean;
  data: any;
  totalImplant: number;
}
const colors = ['rgba(0, 204, 212, 0.1)', 'rgba(0, 204, 212, 0.2)', 'rgba(0, 204, 212, 0.3)'];
const Box = ({ color, total, count, text, style, percentage }: any) => (
  <View style={[styles.box, style, {
    backgroundColor: color
  }]}>
    <Text style={[styles.text, {
      color: Colors.themeColor, textAlign: 'left', fontWeight: 'normal',
    }]}>{percentage + '%'}</Text>
    <Text style={[styles.text, {
      color: Colors.blueColor,
      fontSize: fontRatio(20),
      paddingTop: 4,
      paddingBottom: 10
    }]}>{count}</Text>
    <Text style={[styles.text, { color: Colors.blueColor }]}>{text}</Text>
  </View>

);

class ImplantsStatistics extends React.Component<ImplantsStatisticstProps, StateProps> {
  scrollView: any;
  focusListener: any;
  constructor(props: Readonly<ImplantsStatisticstProps>) {
    super(props);
    this.navigateToImplantsListView = this.navigateToImplantsListView.bind(this);
    this.navigateToCreateImplantView = this.navigateToCreateImplantView.bind(this);
    this.navigateToStatisticsView = this.navigateToStatisticsView.bind(this);
    this.navigateToStatisticsFilterView = this.navigateToStatisticsFilterView.bind(this);
    this.state = {
      isSuccessSelected: true,
      isPersonalSelected: true,
      data: undefined,
      totalImplant: 0
    }
  }

  navigateToImplantsListView = () => {
    this.props.navigation.navigate("Implants List");
  }

  componentDidUpdate(prevProps: any) {
    if (!_.isEqual(prevProps.statisticsList, this.props.statisticsList)) {
      this.toggleData()
    }
    return null;
  }

  componentDidMount() {
    this.props.getImplantStatistics({
      timeline: 12,
      amount: { min: 0, max: 3000 },
      diameter: { min: 2, max: 10 },
      length: { min: 2, max: 54 },
    }, false);
    this.focusListener = this.props.navigation.addListener('focus', this.scrollToTop);
  }

  componentWillUnmount() {
    this.focusListener();
  }

  scrollToTop = () => {
    if (this.props.route.params && !_.isEmpty(this.props.route.params)) {
      this.setState({
        isSuccessSelected: this.props.route.params.isSuccessSelected
      }, () => {
        this.toggleData();
      });
      this.props.route.params = undefined;
    }
    this.scrollView &&
      this.scrollView.scrollTo && this.scrollView.scrollTo({ x: 0, y: 0, animated: false })
  }

  navigateToCreateImplantView = () => {
    this.props.navigation.navigate("Create Implant",  { screen: 'ScanImplant',  params: {implants: []} });
  }

  toggleSelection = (flag: boolean) => {
    this.setState({
      isSuccessSelected: flag
    }, () => {
      this.toggleData();
    });
  }

  togglePersonalSelection = (flag: boolean) => {
    this.setState({
      isPersonalSelected: flag
    }, () => {
      this.toggleData();
    });
  }

  formatData = (data: any) => {
    const modifiedArr = data.map((item: any) => {
      item.y = item.y > 0 ? -1 * item.y : item.y
      return item
    });
    return modifiedArr;
  }

  formatScatterData = (data: any) => {
    let modifiedArr = data.map((item: any) => {
      item.y = item.y > 0 ? -1 * item.y : item.y
      return item
    });
    modifiedArr = modifiedArr.filter((item: any) => item.y !== 0);
    return modifiedArr;
  }

  getImplantData = () => {
    let data;
    const statisticsList = this.props.statisticsList;
    const isPersonalSelected = this.state.isPersonalSelected;
    if (statisticsList) {
      if (isPersonalSelected) {
        data = statisticsList.personal;
      } else {
        data = statisticsList.general;
      }
    }

    return data;
  }
  filterList = (list: any, filteredList: any) => {
    list && list.map((item: any) => {
      item.total = item.count || 0;
      const filteredFailureData = (filteredList && filteredList.filter((innerItem: any) => innerItem.text === item.text)) || [];
      if(filteredFailureData && filteredFailureData.length > 0 ) {
         item.total += filteredFailureData[0].count;
      }
    });

    return list || [];
  }
  toggleData = () => {
    let data;
    let totalImplant;
    const isSuccessSelected = this.state.isSuccessSelected;
    if (this.getImplantData()) {
      const { total, success, failure } = this.getImplantData();
      totalImplant = total;
      success.topThreeImplants = this.filterList(success.topThreeImplants, failure.topThreeImplants);
      failure.topThreeImplants = this.filterList(failure.topThreeImplants, success.topThreeImplants);
      if (isSuccessSelected) {
        data = success;
      } else {
        data = failure;

      }

      this.setState({
        data: data,
        totalImplant: totalImplant,
      });
    }

  }

  navigateToStatisticsView = () => {
    const { isPersonalSelected, isSuccessSelected } = this.state;

    this.props.navigation.navigate('Statistics', {
      isSuccessSelected: isSuccessSelected,
      isPersonalSelected: isPersonalSelected,
      data: this.getImplantData(),
    })
  }
  getPercentage = (count: number, total: number) => {
    return (total > 0 ? (((count / total) * 100) % 1 !== 0 ? ((count / total) * 100).toFixed(2) : ((count / total) * 100))
      : 0);
  }

  navigateToStatisticsFilterView = () => {
    this.props.navigation.navigate('StatisticsFilter');
  }

  render() {
    const { navigation, name, isLoading, statisticsError } = this.props;
    const { data, totalImplant } = this.state;
    return (
      <Fragment>
       <SafeAreaView style={styles.saveAreaBackgrounColor} />
       <SafeAreaView style={styles.saveAreaView}>
       <Header
          navigation={navigation}
          name={name}
          isSuccessSelected={this.state.isSuccessSelected}
          toggleSelection={this.toggleSelection}
          title={I18n.t('implantsStatistics')}
          navigateToStatisticsFilterView={this.navigateToStatisticsFilterView}
        />
      <View style={{ flex: 1, backgroundColor: "#288AF8" }}>
       <View style={Platform.OS == 'ios' ? {
        height: 5,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        //backgroundColor: "#288AF8",
        shadowColor: "#288AF8",
        shadowOffset: {
          width: 0,
          height: -20,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4} : {}}/>
        <LinearGradient
          colors={[Colors.whiteColor, '#e8e8e8']}
          style={styles.linearGradient}>

          {isLoading || !this.state.data ?
            <ActivityIndicator color={Colors.themeColor} size="large" style={{ marginTop: 100 }} />
            : statisticsError ?
              <View style={[styles.row, { marginTop: 100 }]}>
                <Text style={styles.error}> {statisticsError} </Text>
              </View>
              : <View style={styles.content}>
                <View style={styles.btnWrapper}>
                  <TouchableOpacity style={[styles.btnContianer, {
                    borderRightWidth: 1,
                    borderColor: 'transparent',
                    borderStyle: 'solid',
                    backgroundColor: this.state.isPersonalSelected ?
                      'transparent' : Colors.themeColor
                  }]}
                    onPress={() => { this.togglePersonalSelection(true) }}
                  >
                    <Text style={[styles.text, {
                      color: this.state.isPersonalSelected ?
                        Colors.lightGreenColor : Colors.whiteColor
                    }]}>{I18n.t('personal')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.btnContianer, {
                    backgroundColor: !this.state.isPersonalSelected ?
                      'transparent' : Colors.themeColor
                  }]}
                    onPress={() => { this.togglePersonalSelection(false) }}
                  >
                    <Text style={[styles.text, {
                      color: !this.state.isPersonalSelected ?
                        Colors.lightGreenColor : Colors.whiteColor
                    }]}>{I18n.t('general')}</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView ref={ref => this.scrollView = ref}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="always"
                  contentContainerStyle={styles.contentView}>
                  <AreaChart data={this.formatData(data.implantsPerMonth)} scatterData={this.formatScatterData(data.implantsPerMonth)} total={totalImplant} />
                  <View style={styles.countContainer}>
                    <Text style={styles.count}>{data.total}</Text>
                    <Text style={[styles.text, {
                      color: Colors.blueColor
                    }]}>{'out of ' + totalImplant + ' (' + this.getPercentage(data.total, totalImplant) + '%)'}</Text>
                  </View>
                  {(data.topThreeImplants && data.topThreeImplants.length > 0) ?
                    <TouchableOpacity style={styles.topThreeContainer} onPress={this.navigateToStatisticsView}>
                      <View style={[styles.row, {
                        padding: 8,
                        backgroundColor: Colors.lightGrayColor,
                        borderTopRightRadius: 15,
                        borderTopLeftRadius: 15,
                      }]}>
                        <Serial />
                        <Text style={[styles.innerText, {
                          paddingLeft: 5,
                        }]}>{I18n.t('topthreeImplant')}</Text>
                      </View>
                      <View style={[styles.row, {
                        shadowColor: 'rgba(0, 0, 0, 0.16)',
                        shadowOffset: {
                          width: 5,
                          height: 5,
                        },
                        elevation: 0.15,
                        shadowOpacity: 10,
                        shadowRadius: 10,
                      }]}>
                        {data.topThreeImplants.map((item: any, index: any) => (
                          <Box
                            key={index}
                            color={colors[index]}
                            text={item.text}
                            count={item.count}
                            total={data.total}
                            percentage={this.getPercentage(item.count, item.total)}
                            style={{
                              borderBottomLeftRadius: 0,
                              borderBottomRightRadius: 0 ,
                            }}
                          />
                        ))}
                      </View>
                    </TouchableOpacity>
                    : <View style={{ marginTop: 16 }} />
                  }
                </ScrollView>
              </View>

          }
        </LinearGradient>
        <LinearGradient
          colors={[Colors.whiteColor, '#e8e8e8']}
          style={styles.footerLinearGradient}>
              <View style={styles.footer}>
                <TouchableOpacity onPress={this.navigateToImplantsListView} style={[styles.footerContent, {
                  paddingLeft: 30, alignItems: 'center',
                }]}><Text style={styles.implantList}>{I18n.t('implantList')}</Text></TouchableOpacity>
                <TouchableOpacity onPress={this.navigateToCreateImplantView} style={styles.footerContent}><Add style={{marginTop: 10 }} width={112} height={83} /></TouchableOpacity>
              </View>
        </LinearGradient>
        
      </View>
      </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  linearGradient: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1.4,
    shadowColor: 'rgba(0, 0, 0, 0.16)',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.23,
    shadowRadius: 10,
    elevation: 4,
  },
  saveAreaBackgrounColor: {
    flex: 0,
    backgroundColor: Colors.themeColor,
  },
  saveAreaView: {
      flex: 1,
      backgroundColor: '#e8e8e8',
      paddingTop: Platform.OS === 'android' ?  getStatusBarHeight() : 0 ,
  },
  footer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  footerLinearGradient: {
    //flex: 1,
    shadowColor: 'rgba(0, 0, 0, 0.16)',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.23,
    shadowRadius: 15,
    elevation: 4,
    height: 70,
    justifyContent: "center"
  },
  back: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '300',
    fontStyle: 'normal',
    textAlign: 'center',
    color: Colors.blueColor,
    paddingLeft: 15
  },
  footerContent: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: "center"
  },
  contentView: {
    width: '100%',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',

  },
  text: {
    fontFamily: 'System',
    fontSize: fontRatio(14),
    fontWeight: '500',
    fontStyle: 'normal',
    color: Colors.lightGreenColor,
    textAlign: 'center',
  },
  btnWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnContianer: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: Colors.themeColor,
    width: Dimensions.get('window').width / 2
  },
  topThreeContainer: {
    flexDirection: 'column',
    marginBottom: 16,
    width: Dimensions.get('window').width * 0.9
  },
  row: {
    flexDirection: 'row',
  },
  innerText: {
    fontFamily: 'System',
    fontSize: fontRatio(12),
    fontWeight: '300',
    fontStyle: 'normal',
    color: Colors.blueColor,
    textAlign: 'left',
  },
  box: {
    backgroundColor: Colors.lightGreenColor,
    paddingTop: 5,
    paddingLeft: 6,
    paddingBottom: 10,
    flex: 1,
  },
  countContainer: {
    flexDirection: 'column',
    paddingBottom: 20,
    paddingTop: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  count: {
    fontFamily: 'System',
    fontSize: fontRatio(50),
    fontWeight: 'normal',
    fontStyle: 'normal',
    color: Colors.lightGreenColor,
    textAlign: 'left',
  },
  error: {
    color: 'red',
    fontSize: fontRatio(20),
    fontFamily: 'System',
    fontStyle: 'normal',
    textAlign: 'center',
  },
  implantList: {
    fontFamily: 'System',
    fontSize: fontRatio(14),
    fontWeight: 'bold',
    fontStyle: 'normal',
    color: Colors.themeColor,
    textAlign: 'left',
  }
});

const mapStateToProps = (state: { auth: { userData: { name: any; }; }; statistics: { isLoading: any; statisticsError: any; statisticsList: any; }; }) => ({
  name: state.auth.userData.name,
  isLoading: state.statistics.isLoading,
  statisticsError: state.statistics.statisticsError,
  statisticsList: state.statistics.statisticsList
});
export default connect(mapStateToProps, {
  getImplantStatistics: visitActions.getImplantStatistics
})(ImplantsStatistics);