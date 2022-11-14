import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { Colors, fontRatio } from '../../styles/StyleSheet';
import moment from 'moment';
import I18n from '../../l18n/I18n';
// @ts-ignore
import Tooth from '../../../assets/images/tooth.svg';
// @ts-ignore
import Serial from '../../../assets/images/serial.svg';
// @ts-ignore
import WhiteTooth from '../../../assets/images/whiteTooth.svg';
// @ts-ignore
import WhiteSerial from '../../../assets/images/whiteSerial.svg';
// @ts-ignore
import GrayTooth from '../../../assets/images/grayTooth.svg';
// @ts-ignore
import GraySerial from '../../../assets/images/graySerial.svg';
import { TouchableOpacity } from 'react-native-gesture-handler';
// @ts-ignore
import ReportAFailure from '../../../assets/images/reportAFailure.svg';
// @ts-ignore
import Diameter from '../../../assets/images/diameter.svg';
// @ts-ignore
import Length from '../../../assets/images/length.svg';
// @ts-ignore
import Percentage from '../../../assets/images/percentage.svg';
// @ts-ignore
import WhitePercentage from '../../../assets/images/whitePercentage.svg';
// @ts-ignore
import GrayPercentage from '../../../assets/images/grayPercentage.svg';
// @ts-ignore
import WhiteDiameter from '../../../assets/images/whiteDiameter.svg';
// @ts-ignore
import GrayDiameter from '../../../assets/images/grayDiameter.svg';
// @ts-ignore
import WhiteLength from '../../../assets/images/whiteLength.svg';
// @ts-ignore
import GrayLength from '../../../assets/images/grayLength.svg';
import { StackNavigationProp } from '@react-navigation/stack';

interface HeaderProps {
    visit: any,
    title: string,
    headerText?: boolean,
    createImplant?: boolean,
    navigation: StackNavigationProp<{
        "ReportAFailure": {};
    }, "ReportAFailure">;
}

interface StateProps {
    selectedIndex: number,
}

let innerTouchable = false;
class ImplantDetailsHeader extends React.Component<HeaderProps, StateProps> {
    constructor(props: Readonly<HeaderProps>) {
        super(props);
        this.state = {
            selectedIndex: 0,
        }
        this.setSelectedIndex = this.setSelectedIndex.bind(this);
    }

    setSelectedIndex = (index: number) => {
        if (!innerTouchable) {
            this.setState({ selectedIndex: index });
        } else {
            innerTouchable = false;
        }
    }
    navigateToReportAFailureView = (item: any) => {
        innerTouchable = true;
        this.props.navigation.navigate('ReportAFailure', {
            date: item.date,
            id: item.id,
            toothNum: item.toothNum,
            serialNum: item.Implant && item.Implant.ImplantLabel &&
                item.Implant.ImplantLabel.label,
            nextStageNumber: '1',
            manufacturerModel: item.Implant && item.Implant.ImplantLabel &&
                item.Implant.ImplantLabel.ManufacturerModel,
        });
    }
    render() {
        const { visit, title, headerText, createImplant } = this.props;
        return (
            <View>
                {headerText && <View style={styles.header}>
                    <Text style={styles.title}>{I18n.t('PatientInformationHeader')}</Text>
                </View>}
                <View style={styles.patientInformationHeader}>
                    <Text style={styles.patientInformationTitle}>{title}</Text>
                </View>
                <View style={[styles.row, { marginBottom: 20 }]}>
                    {visit.Installs[this.state.selectedIndex].Implant &&
                        visit.Installs[this.state.selectedIndex].Implant.ImplantLabel &&
                        visit.Installs[this.state.selectedIndex].Implant.ImplantLabel.imageUrl &&
                        <View style={{
                            height: visit.Installs.length > 1 && !createImplant ? '50%' : '100%',
                        }}><Image
                                style={[styles.stretch, {
                                    resizeMode: visit.Installs.length > 1 && !createImplant ? 'contain' : 'stretch'
                                }]}
                                source={{
                                    uri: createImplant ? `${visit.Installs[this.state.selectedIndex].Implant.ImplantLabel.imageUrl}` : visit.Installs[this.state.selectedIndex].Implant.ImplantLabel.imageUrl,
                                }} />
                        </View>
                    }
                    <View style={[styles.column, { paddingLeft: 10 }]}>
                        <View style={[styles.row, { paddingBottom: 10 }]}>
                            <Text style={styles.date}>{moment(visit.date).format('DD/MM/YY')}</Text>
                        </View>
                        <View style={[styles.row, {
                            flex: 1,
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                        }]}>
                            {
                                visit.Installs.length > 1 ? visit.Installs.map((item: any, index: any) => (
                                    <View style={[styles.column, {
                                        marginRight: 8,
                                        flex: 0,
                                        width: '46%',
                                        marginBottom: 10,
                                    }]} key={index}>
                                        <TouchableOpacity style={[styles.column, styles.installsContainer,
                                        { backgroundColor: this.state.selectedIndex === index ? Colors.themeColor : Colors.grayColor },
                                        createImplant ? { backgroundColor: undefined, marginRight: 0 } : { height: 180 },
                                        ]} onPress={createImplant ? () => null : () => this.setSelectedIndex(index)}>
                                            {(this.state.selectedIndex === index && !createImplant) && <TouchableOpacity onPress={() => this.navigateToReportAFailureView({ ...item, date: visit.date })} style={{ alignItems: 'flex-end' }}><ReportAFailure width={25} height={25} /></TouchableOpacity>}
                                            <View style={[styles.row, { alignItems: 'center'}]}>
                                                <View style={{ flex: 0.5 }}>{createImplant ? <Percentage /> : (this.state.selectedIndex === index ? <WhitePercentage /> : <GrayPercentage />)}</View>
                                                <View style={{ flex: 4 }}><Text style={[styles.iconText, {
                                                    color: createImplant ? Colors.blueColor : (this.state.selectedIndex === index ? Colors.whiteColor : Colors.blueColor),
                                                    opacity: createImplant ? 1 : (this.state.selectedIndex === index ? 1 : 1)
                                                }, createImplant ? { flex: 0, paddingLeft: 0, marginLeft: 10 } : {}]} numberOfLines={1}>{item.Implant &&
                                                    item.Implant.ImplantLabel && item.Implant.ImplantLabel.ManufacturerModel ? item.Implant.ImplantLabel.ManufacturerModel.Manufacturer.name : '--'}</Text></View>
                                            </View>
                                            <View style={[styles.row, { alignItems: 'center', paddingTop: 10  }]}>
                                                <View style={{ flex: 0.5 }}>{createImplant ? <Tooth /> : (this.state.selectedIndex === index ? <WhiteTooth /> : <GrayTooth />)}</View>
                                                <View style={{ flex: 4 }}><Text style={[styles.iconText, {
                                                    color: createImplant ? Colors.blueColor : (this.state.selectedIndex === index ? Colors.whiteColor : Colors.blueColor),
                                                    opacity: createImplant ? 1 : (this.state.selectedIndex === index ? 1 : 1)
                                                }, createImplant ? { flex: 0, paddingLeft: 0, marginLeft: 10 } : {}]} numberOfLines={1}>{item.toothNum || '--'}</Text></View>
                                            </View>
                                            <View style={[styles.row, { alignItems: 'center', paddingTop: 10  }]}>
                                                <View style={{ flex: 0.5 }}>{createImplant ? <Serial /> : (this.state.selectedIndex === index ? <WhiteSerial /> : <GraySerial />)}</View>
                                                <View style={{ flex: 4 }}><Text style={[styles.iconText, {
                                                    color: createImplant ? Colors.blueColor : (this.state.selectedIndex === index ? Colors.whiteColor : Colors.blueColor),
                                                    opacity: createImplant ? 1 : (this.state.selectedIndex === index ? 1 : 1),
                                                }, createImplant ? { flex: 0, paddingLeft: 0, marginLeft: 10 } : {}]} numberOfLines={1}>{item.Implant && item.Implant.ImplantLabel ? item.Implant.ImplantLabel.label : '--'}</Text></View>
                                            </View>
                                            <View style={[styles.row, { alignItems: 'center', paddingTop: 10  }]}>
                                                <View style={{ flex: 0.5 }}>{createImplant ? <Serial /> : (this.state.selectedIndex === index ? <WhiteSerial /> : <GraySerial />)}</View>
                                                <View style={{ flex: 4 }}><Text style={[styles.iconText, {
                                                    color: createImplant ? Colors.blueColor : (this.state.selectedIndex === index ? Colors.whiteColor : Colors.blueColor),
                                                    opacity: createImplant ? 1 : (this.state.selectedIndex === index ? 1 : 1),
                                                }, createImplant ? { flex: 0, paddingLeft: 0, marginLeft: 10 } : {}]} numberOfLines={1}>{item.Implant && item.Implant.ImplantLabel && item.Implant.ImplantLabel.lot ? item.Implant.ImplantLabel.lot : '--'}</Text></View>
                                            </View>
                                            <View style={[styles.row, { alignItems: 'center', paddingTop: 10 }]}>
                                                <View style={{ flex: 0.5 }}>{createImplant ? <Diameter /> : (this.state.selectedIndex === index ? <WhiteDiameter /> : <GrayDiameter />)}</View>
                                                <View style={{ flex: 4 }}><Text style={[styles.iconText, {
                                                    color: createImplant ? Colors.blueColor : (this.state.selectedIndex === index ? Colors.whiteColor : Colors.blueColor),
                                                    opacity: createImplant ? 1 : (this.state.selectedIndex === index ? 1 : 1),
                                                }, createImplant ? { flex: 0, paddingLeft: 0, marginLeft: 10 } : {}]} numberOfLines={1}>{item.Implant && item.Implant.ImplantLabel && item.Implant.ImplantLabel.diameter ? item.Implant.ImplantLabel.diameter : '--'}</Text></View>
                                            </View>
                                            <View style={[styles.row, { alignItems: 'center', paddingTop: 10  }]}>
                                            <View style={{ flex: 0.5 }}>{createImplant ? <Length /> : (this.state.selectedIndex === index ? <WhiteLength /> : <GrayLength />)}</View>
                                                <View style={{ flex: 4 }}><Text style={[styles.iconText, {
                                                    color: createImplant ? Colors.blueColor : (this.state.selectedIndex === index ? Colors.whiteColor : Colors.blueColor),
                                                    opacity: createImplant ? 1 : (this.state.selectedIndex === index ? 1 : 1),
                                                }, createImplant ? { flex: 0, paddingLeft: 0, marginLeft: 10 } : {}]} numberOfLines={1}>{item.Implant && item.Implant.ImplantLabel && item.Implant.ImplantLabel.length ? item.Implant.ImplantLabel.length : '--'}</Text></View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )) : <View style={styles.column}>
                                        <View style={[styles.row, { paddingBottom: 5 }]}>
                                            <View style={styles.column}>
                                                <View style={[styles.row, { alignItems: 'center' }]}>
                                                    <Percentage />
                                                    <Text style={[styles.iconText, { flex: 1 }]}>{visit.Installs[0] && visit.Installs[0].Implant &&
                                                        visit.Installs[0].Implant.ImplantLabel && visit.Installs[0].Implant.ImplantLabel.ManufacturerModel ? visit.Installs[0].Implant.ImplantLabel.ManufacturerModel.Manufacturer.name : '--'}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.column}>
                                                <View style={[styles.row, { alignItems: 'center' }]}>
                                                    <Tooth />
                                                    <Text style={[styles.iconText, { flex: 1 }]}>{(visit.Installs[0] && visit.Installs[0].toothNum) || '--'}</Text>
                                                </View>
                                            </View>

                                        </View>
                                        <View style={[styles.row, { paddingTop: 5 }]}>
                                            <View style={styles.column}>
                                                <View style={[styles.row, { alignItems: 'center' }]}>
                                                    <Serial />
                                                    <Text style={[styles.iconText, { flex: 1 }]}>{visit.Installs[0] && visit.Installs[0].Implant &&
                                                        visit.Installs[0].Implant.ImplantLabel ? visit.Installs[0].Implant.ImplantLabel.label : '--'}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.column}>
                                                <View style={[styles.row, { alignItems: 'center' }]}>
                                                    <Serial />
                                                    <Text style={[styles.iconText, { flex: 1 }]}>{visit.Installs[0] && visit.Installs[0].Implant &&
                                                        visit.Installs[0].Implant.ImplantLabel && visit.Installs[0].Implant.ImplantLabel.lot ? visit.Installs[0].Implant.ImplantLabel.lot : '--'}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={[styles.row, { paddingTop: 5 }]}>
                                            <View style={styles.column}>
                                                <View style={[styles.row, { alignItems: 'center' }]}>
                                                    <Diameter />
                                                    <Text style={[styles.iconText, { flex: 1 }]}>{visit.Installs[0] && visit.Installs[0].Implant &&
                                                        visit.Installs[0].Implant.ImplantLabel  && visit.Installs[0].Implant.ImplantLabel.diameter? visit.Installs[0].Implant.ImplantLabel.diameter : '--'}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.column}>
                                                <View style={[styles.row, { alignItems: 'center' }]}>
                                                    <Length />
                                                    <Text style={[styles.iconText, { flex: 1 }]}>{visit.Installs[0] && visit.Installs[0].Implant &&
                                                        visit.Installs[0].Implant.ImplantLabel && visit.Installs[0].Implant.ImplantLabel.length ? visit.Installs[0].Implant.ImplantLabel.length : '--'}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                            }
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: '10%',
        marginBottom: 23,
    },
    title: {
        fontFamily: 'System',
        fontSize: 12,
        fontWeight: 'normal',
        fontStyle: 'normal',
        textAlign: 'left',
        color: Colors.blueColor,
        lineHeight: 18
    },
    date: {
        fontFamily: 'System',
        fontSize: 14,
        fontWeight: '300',
        fontStyle: 'normal',
        textAlign: 'center',
        color: Colors.blueColor,
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnText: {
        color: Colors.whiteColor
    },
    column: {
        flexDirection: 'column',
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        flex: 1,
        flexWrap: "wrap"
    },
    installsContainer: {
        borderRadius: 9,
        marginRight: 10,
        padding: 12,
       // height: 70,
    },
    iconText: {
        paddingLeft: 10,
        fontFamily: 'System',
        fontSize: fontRatio(13),
        fontWeight: '300',
        fontStyle: 'normal',
        color: Colors.blueColor,
        textAlign: 'left',
    },
    stretch: {
        resizeMode: 'stretch',
        height: 80,
        width: 80,
    },
    patientInformationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },
    patientInformationTitle: {
        fontFamily: 'System',
        fontSize: 16,
        fontWeight: 'normal',
        fontStyle: 'normal',
        textAlign: 'center',
        color: Colors.themeColor,
    },
});

export default ImplantDetailsHeader;
