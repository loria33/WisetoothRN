import React, { Fragment } from 'react';
import { View, Text, StyleSheet, SafeAreaView,ScrollView, Dimensions, FlatList,Platform } from 'react-native';
import { Colors, fontRatio } from '../../styles/StyleSheet';
// @ts-ignore
import Arrow from '../../../assets/images/arrow.svg';
// @ts-ignore
import Percentage from '../../../assets/images/percentage.svg';
// @ts-ignore
import Serial from '../../../assets/images/serial.svg';
// @ts-ignore
import Diameter from '../../../assets/images/diameter.svg';
// @ts-ignore
import Length from '../../../assets/images/length.svg';
// @ts-ignore
import Up from '../../../assets/images/up.svg';
// @ts-ignore
import Right from '../../../assets/images/right.svg';
// @ts-ignore
import Teeth from '../../../assets/images/upperTeeth.svg';
import Header from './Header'
import I18n from '../../l18n/I18n';
import { StackNavigationProp } from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getStatusBarHeight} from 'react-native-status-bar-height';

import * as _ from 'lodash';

interface StatisticsProps {
    route: any;
    navigation: StackNavigationProp<{
        'Implants Statistics': {};
    }, 'Implants Statistics'>;
}

interface StateProps {
    isSuccessSelected: boolean;
    data: any;
    topicsData: any;
}
class Statistics extends React.Component<StatisticsProps, StateProps> {
    scrollView: any;
    focusListener: any;
    constructor(props: Readonly<StatisticsProps>) {
        super(props);
        this.goBack = this.goBack.bind(this);
        this.state = {
            isSuccessSelected: props.route.params.isSuccessSelected,
            data: { statistics: undefined, total: undefined },
            topicsData: []
        }
    }



    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('focus', this.scrollToTop);
        this.toggleData()
    }

    filterList = (list: any, filteredList: any) => {
        list && list.map((item: any) => {
          const key = Object.keys(item)[0];
          const value: any = Object.values(item)[0] || {};
          value.dataTotal = value.total || 0;
          const filteredFailureData = (filteredList && filteredList.filter((innerItem: any) =>  {
            const innerKey = Object.keys(innerItem)[0];
            if(key === innerKey) {
                return innerItem;
            }
          })) || [];

          if(filteredFailureData && filteredFailureData.length > 0 ) {
              const innerValue: any = Object.values(filteredFailureData[0])[0] || {};
             value.dataTotal += innerValue.total;
          }
        });

        return list || [];
      }

    toggleData = () => {
        let data;
        const statistics: { key: string; values: any }[] = [];
        const isSuccessSelected = this.state.isSuccessSelected;
        if (this.props.route.params.data) {
            const { success, failure } = this.props.route.params.data;
            success.implants = this.filterList(success.implants, failure.implants);
            failure.implants = this.filterList(failure.implants, success.implants);

            if (isSuccessSelected) {
                data = success;
            } else {
                data = failure;

            }
            data.implants.map((item: any) => {
                statistics.push({
                    key: Object.keys(item)[0],
                    values: Object.values(item)[0]
                })
            })
            this.setState({
                data: { statistics, total: data.total }
            });
        }

    }

    componentWillUnmount() {
        this.focusListener();
    }

    scrollToTop = () => {
        this.scrollView &&
            this.scrollView.scrollTo && this.scrollView.scrollTo({ x: 0, y: 0, animated: false })
    }

    toggleSelection = (flag: boolean) => {
        this.setState({
            isSuccessSelected: flag
        }, () => {
            this.toggleData();
        });
    }

    navigateToStatisticsFilterView = () => {
        this.props.navigation.navigate('StatisticsFilter');
    }

    goBack = () => {
        this.props.navigation.navigate('Implants Statistics', {
            isSuccessSelected: this.state.isSuccessSelected
        });
    }

    getPercentage = (count: number, total: number) => {
        return (total > 0 ? (((count / total) * 100) % 1 !== 0 ? ((count / total) * 100).toFixed(2) : ((count / total) * 100))
            : 0) + '%';
    }

    setTopic = (index: number) => {
        const { statistics, total } = this.state.data;
        const updatedTopicArray = [...statistics]
        updatedTopicArray[index].opened = !updatedTopicArray[index].opened
        this.setState({
            data: { statistics: updatedTopicArray, total: total }
        })
    }

    renderItem = ({ item, index }: any) => (
        <TouchableOpacity style={styles.list}
            onPress={() => this.setTopic(index)}
        >
            <View style={styles.listContent}>
                <View style={[styles.paddingBottom, styles.row]}>
                    <Text style={styles.percentage}>{this.getPercentage(item.values.total, item.values.dataTotal)}</Text>
                </View>
                <View style={[styles.paddingBottom, styles.row]}>
                    <Percentage />
                    <Text style={styles.listText}>{item.key}</Text>
                </View>
                <View style={styles.iconConatiner}>
                    <View style={[styles.row, styles.icon]}>
                        <Serial />
                        <Text style={styles.listText}>{item.values.total}</Text>
                    </View>
                </View>
                {item.opened &&
                    <View style={styles.column}>
                        <View style={[styles.iconConatiner, styles.paddingTop]}>
                            <View style={[styles.row, styles.icon]}>
                                <Teeth />
                                <Text style={styles.listText}>{this.getPercentage(item.values.upperJaw, item.values.total)}</Text>
                            </View>
                            <View style={[styles.row, styles.icon]}>
                                <View style={{
                                    transform: [{ rotate: '180deg' }],
                                }}><Teeth /></View>
                                <Text style={styles.listText}>{this.getPercentage(item.values.lowerJaw, item.values.total)}</Text>
                            </View>
                            <View style={[styles.row, styles.icon]} />
                        </View>
                        <View style={[styles.iconConatiner, styles.paddingTop]}>
                            <View style={[styles.row, styles.icon]}>
                                <Up />
                                <Text style={styles.listText}>{this.getPercentage(item.values.female, item.values.total)}</Text>
                            </View>
                            <View style={[styles.row, styles.icon]}>
                                <Right />
                                <Text style={styles.listText}>{this.getPercentage(item.values.male, item.values.total)}</Text>
                            </View>
                            <View style={[styles.row, styles.icon]} />
                        </View>
                        <View style={[styles.column, { paddingTop: 8 }]}>
                            {
                                item.values.medicalConditions.map((manufacture: any, index: any) => (
                                    <View style={[styles.row, { paddingTop: 8 }]} key={index}>
                                        <Text style={[styles.listText, {
                                            paddingLeft: 0,
                                            color: Colors.themeColor,
                                        }]}>{this.getPercentage(manufacture.count, item.values.total)}</Text>
                                        <Text style={[styles.listText, { textAlign: 'left' }]}>{manufacture.text}</Text>
                                    </View>
                                ))
                            }
                        </View>
                    </View>
                }
            </View>
            <View style={{
                transform: [{ rotate: item.opened ? '180deg' : '0deg' }],
                width: '100%',
                alignItems: 'center'
            }
            }><Arrow /></View>
        </TouchableOpacity>
    );

    render() {
        const { route } = this.props;
        const { isPersonalSelected } = route.params;
        const { isSuccessSelected } = this.state;
        const statistics = this.state.data.statistics;
        return (
            <Fragment>
            <SafeAreaView style={styles.saveAreaBackgrounColor} />
            <SafeAreaView style={styles.saveAreaView}>
            <View style={{ flex: 1, backgroundColor: Colors.themeColor }}>
                <Header
                    isSuccessSelected={isSuccessSelected}
                    toggleSelection={this.toggleSelection}
                    isToHideTitle={true}
                    title={isPersonalSelected ? I18n.t('personalStatistics') : I18n.t('generalStatistics')}
                    navigateToStatisticsFilterView={this.navigateToStatisticsFilterView}
                />
                <LinearGradient
                    colors={[Colors.whiteColor, '#e8e8e8']}
                    style={styles.linearGradient}>
                    <ScrollView ref={ref => this.scrollView = ref}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="always"
                        contentContainerStyle={styles.contentView}>
                        <View style={styles.content}>
                            <View style={styles.titleContainer}>
                                <Text style={styles.title}>{(isSuccessSelected ?
                                    I18n.t('successful') :
                                    I18n.t('failure'))
                                    + ' Implants'}
                                </Text>
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                {statistics &&
                                    <FlatList
                                        data={statistics}
                                        renderItem={this.renderItem}
                                        keyExtractor={(item) => item.key}
                                    />
                                }
                            </View>
                        </View>
                    </ScrollView>
                </LinearGradient>
                <View style={{ height: 70 }}>
                    <LinearGradient
                        colors={[Colors.whiteColor, '#e8e8e8']}
                        style={styles.footerLinearGradient}>
                        <View style={styles.footer}>
                            <TouchableOpacity onPress={this.goBack} style={styles.footerContent}><Text style={styles.back}>{I18n.t('back')}</Text></TouchableOpacity>
                        </View>
                    </LinearGradient>
                </View>
            </View>
            </SafeAreaView>
          </Fragment>
        )
    }
};


const styles = StyleSheet.create({
    footerLinearGradient: {
        flex: 1,
        shadowColor: 'rgba(0, 0, 0, 0.16)',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.23,
        shadowRadius: 15,
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
    linearGradient: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        flex: 3,
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.23,
        shadowRadius: 10,
        elevation: 4,
    },
    footer: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center'
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
    contentView: {
        width: '100%',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        width: '90%',
        justifyContent: 'center'

    },
    listText: {
        fontFamily: 'System',
        fontSize: fontRatio(12),
        fontWeight: '300',
        fontStyle: 'normal',
        color: Colors.blueColor,
        textAlign: 'center',
        paddingLeft: 8
    },
    row: {
        flexDirection: 'row',
    },
    error: {
        color: 'red',
        fontSize: fontRatio(20),
        fontFamily: 'System',
        fontStyle: 'normal',
        textAlign: 'center',
    },
    footerContent: {
        justifyContent: 'center',
        flexDirection: 'row',
        alignSelf: 'center',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 50,
        paddingBottom: 5,
    },
    title: {
        fontFamily: 'System',
        fontSize: fontRatio(16),
        fontWeight: 'normal',
        fontStyle: 'normal',
        color: Colors.themeColor,
        textAlign: 'center',
    },
    list: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: Dimensions.get('window').width * 0.9
    },
    listContent: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingLeft: 24,
        paddingRight: 24,
        paddingBottom: 8,
        paddingTop: 5,
    },
    percentage: {
        fontFamily: 'System',
        fontSize: fontRatio(29),
        fontWeight: 'normal',
        fontStyle: 'normal',
        color: Colors.lightGreenColor,
        textAlign: 'center',
    },
    paddingBottom: {
        paddingBottom: 16
    },
    paddingTop: {
        paddingTop: 16
    },
    iconConatiner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    column: {
        flexDirection: 'column'
    },
    icon: {
        width: '34%'
    }
});
export default Statistics;
