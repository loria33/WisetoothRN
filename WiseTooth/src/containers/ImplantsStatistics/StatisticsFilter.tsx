import React, { Fragment } from 'react';
import { StyleSheet, View, Text, SafeAreaView, Dimensions, ActivityIndicator, Platform } from 'react-native';
import Header from '../../components/Header'
import I18n from '../../l18n/I18n';
import { Colors, fontRatio } from '../../styles/StyleSheet'
import LinearGradient from 'react-native-linear-gradient';
// @ts-ignore
import Implants from '../../../assets/images/implants.svg';
// @ts-ignore
import Switch from '../../../assets/images/switch.svg';
// @ts-ignore
import Length from '../../../assets/images/length.svg';
// @ts-ignore
import ImplantsListIcon from '../../../assets/images/implantsList.svg';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
// @ts-ignore
import Manufacturer from '../../../assets/images/manufacturer.svg';
// @ts-ignore
import Diameter from '../../../assets/images/diameter.svg';
// @ts-ignore
import Timeline from '../../../assets/images/timeline.svg';
// @ts-ignore
import Unchecked from '../../../assets/images/unchecked.svg';
// @ts-ignore
import Checked from '../../../assets/images/checked.svg';
// @ts-ignore
import ApplyFilter from '../../../assets/images/apply_filters.svg';
// @ts-ignore
import Gender from '../../../assets/images/gender.svg';
// @ts-ignore
import MedicalCondition from '../../../assets/images/medicalCondition.svg';
// @ts-ignore
import Jaw from '../../../assets/images/jaw.svg';
// @ts-ignore
import Reset from '../../../assets/images/reset.svg';
import Picker from '../../components/Picker';
import { Slider, CheckBox } from 'react-native-elements';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { connect } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import * as visitActions from '../../redux/actions/visit';
import * as userActions from '../../redux/actions/user';
import { getStatusBarHeight } from 'react-native-status-bar-height';

interface SelectValueProps {
  checked: (text: string) => boolean;
  changeValue: (val: string) => void;
  text: string;
}

const fieldWidth = Dimensions.get("window").width * 0.4;

const SelectValue = (props: SelectValueProps) => (
  <TouchableOpacity onPress={() => props.changeValue(props.text)} style={[styles.selectOptionsItem, props.checked(props.text) ? { backgroundColor: Colors.themeColor } : {}]}>
    <Text style={[styles.selectionOptionsItemText, props.checked(props.text) ? { color: Colors.whiteColor } : {}]}>{props.text}</Text>
  </TouchableOpacity>
)

interface StatisticsFilterProps {
  medicalConditions: any;
  navigation: StackNavigationProp<{
    'Implants Statistics': {};
  }, 'Implants Statistics'>;
  manufactures: any;
  getImplantStatistics: (values: any, navigateToStatisticsView: boolean) => void;
  getMedicalConditions: () => void;
  getManufactures: () => void;
  isLoading: boolean;
  filterOptions: any;
}

interface StatisticsFilterState {
  manufacturer: string;
  timeline: number;
  checked: boolean;
  amountValueOne: number;
  amountValueTwo: number;
  lengthValueOne: number;
  lengthValueTwo: number;
  diameterValueOne: number;
  diameterValueTwo: number;
  gender: any;
  jaw: any;
  checkedMedicalConditions: any;
}


class StatisticsFilter extends React.Component<StatisticsFilterProps, StatisticsFilterState> {
  scrollView: any;
  focusListener: any;
  constructor(props: StatisticsFilterProps) {
    super(props);
    const { gender, timeline, jaw, manufacturer, medicalConditionId, amount, diameter, length } = this.props.filterOptions || {}
    this.state = {
      checkedMedicalConditions: medicalConditionId ? this.getCheckedMedicalConditions(medicalConditionId) : [],
      gender: gender || undefined,
      jaw: jaw || undefined,
      manufacturer: manufacturer,
      timeline: timeline || 12,
      checked: false,
      amountValueOne: amount? amount.min : 0,
      amountValueTwo: amount? amount.max : 3000,
      lengthValueOne: length? length.min : 2,
      lengthValueTwo: length? length.max : 54,
      diameterValueOne: diameter? diameter.min : 2,
      diameterValueTwo: diameter? diameter.max : 10
    }
    this.gender = this.gender.bind(this);
    this.jaw = this.jaw.bind(this);
    this.changeGenderValue = this.changeGenderValue.bind(this);
    this.changeJawValue = this.changeJawValue.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.onReset = this.onReset.bind(this);
  }

  getCheckedMedicalConditions = (medicalConditionId: string) => {
    return medicalConditionId.split(',').map((item: any) => item = Number(item));
  }

  getManufacturerName = (id: string) => {
    const manufacture = this.props.manufactures &&
      this.props.manufactures.filter((item: any) => item.id === id)[0];
    return (manufacture && manufacture.name) || id;
  }

  componentDidMount() {
    const { getManufactures, getMedicalConditions } = this.props;
    getMedicalConditions();
    getManufactures();
    this.focusListener = this.props.navigation.addListener('focus', this.scrollToTop);
  }

  componentWillUnmount() {
    this.focusListener();
  }

  scrollToTop = () => {
    this.scrollView &&
      this.scrollView.scrollTo && this.scrollView.scrollTo({ x: 0, y: 0, animated: false })
  }

  goBack = () => {
    this.props.navigation.goBack();
  }
  gender(val: string) {
    return this.state.gender == val;
  }

  jaw(val: string) {
    return this.state.jaw == val;
  }

  changeGenderValue(gender: string) {
    this.setState({ gender });
  }

  changeJawValue(jaw: string) {
    this.setState({ jaw });
  }

  onReset = () => {
    this.setState({
      checkedMedicalConditions: [],
      gender: undefined,
      jaw: undefined,
      manufacturer: "",
      timeline: 12,
      checked: false,
      amountValueOne: 0,
      amountValueTwo: 3000,
      lengthValueOne: 2,
      lengthValueTwo: 54,
      diameterValueOne: 2,
      diameterValueTwo: 10
    })
  }
  onFilter = () => {
    const {
      gender,
      jaw,
      manufacturer,
      timeline,
      amountValueOne,
      amountValueTwo,
      lengthValueOne,
      lengthValueTwo,
      diameterValueOne,
      diameterValueTwo,
      checkedMedicalConditions
    } = this.state;
    this.props.getImplantStatistics({
      gender,
      timeline,
      jaw,
      manufacturer: this.getManufacturerName(manufacturer),
      medicalConditionId: checkedMedicalConditions.join(','),
      amount: { min: amountValueOne, max: amountValueTwo },
      diameter: { min: diameterValueOne, max: diameterValueTwo },
      length: { min: lengthValueOne, max: lengthValueTwo }
    }, true);
  }

  render() {
    const { navigation, medicalConditions, manufactures, isLoading } = this.props;
    return (
      <Fragment>
        <SafeAreaView style={styles.saveAreaBackgrounColor} />
        <SafeAreaView style={styles.saveAreaView}>
          <View style={{ flex: 1, backgroundColor: Colors.themeColor }}>
            <Header title={I18n.t('statisticsFilter')} navigation={navigation} color={Colors.whiteColor} />
            <Text style={styles.mainText}>{I18n.t('statisticsFilterMainText')}</Text>
            <LinearGradient
              colors={[Colors.whiteColor, Colors.wisetoothGray]}
              style={styles.linearGradient}>
              <ScrollView ref={ref => this.scrollView = ref}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="always"
                contentContainerStyle={styles.contentView}>
                {!manufactures || !medicalConditions ?
                  <ActivityIndicator color={Colors.themeColor} size="large" style={{ marginTop: 100 }} />
                  :
                  <View style={styles.contentContainer}>
                    <View style={[styles.filterRow, { alignItems: "flex-start" }]}>
                      <View style={[styles.row, { marginTop: 25 }]}>
                        <Manufacturer />
                        <Text style={{ marginLeft: 15, ...styles.itemText }}>{I18n.t('manufacturer')}</Text>
                      </View>
                      <Picker
                        value={this.state.manufacturer}
                        fieldName={"specialityId"}
                        useIdAsATheValue={true}
                        label={I18n.t('manufacturer')}
                        style={{
                          marginLeft: 15, marginTop: 10, width: '60%', elevation: 5, zIndex: 3
                        }}
                        options={manufactures}
                        errorMessage={undefined}
                        labelStyle={styles.label}
                        setFieldValue={(fieldName, value) => this.setState({ manufacturer: value })}
                        touched={false}
                        pickerStyle={styles.picker}
                        resetMode={true}
                        lastView={true}
                      />
                    </View>
                    <View style={styles.filterRow}>
                      <View style={styles.row}>
                        <Timeline />
                        <Text style={{ marginLeft: 15, ...styles.itemText }}>Timeline</Text>
                      </View>
                      <View style={{ marginLeft: 40, width: "60%" }}>
                        <Text style={styles.textAboveTheSlider}>{`Past ${this.state.timeline} Months`}</Text>
                        <Slider
                          value={this.state.timeline}
                          onValueChange={(val: number) => this.setState({ timeline: val })}
                          maximumValue={12}
                          minimumValue={1}
                          minimumTrackTintColor={Colors.themeColor}
                          maximumTrackTintColor={Platform.OS == "android" ? Colors.themeColor : "rgba(43, 143, 255, 0.3)"}
                          step={1}
                          style={{ flex: 1 }}
                          thumbStyle={styles.sliderThumb}
                          trackStyle={{ height: 2 }}
                        />
                      </View>
                    </View>
                    <View style={styles.divider} />
                    <View style={[styles.filterRow, styles.width]}>
                      <View style={styles.row}>
                        <Switch />
                        <Implants style={{ marginLeft: 15, color: Colors.themeColor }} />
                        <Text style={{ marginLeft: 15, ...styles.itemText }}>Amount</Text>
                      </View>
                      <View style={styles.marginLeft}>
                        <MultiSlider
                          allowOverlap={false}
                          onValuesChange={(values) => {
                            this.setState({ amountValueOne: values[0], amountValueTwo: values[1] });
                          }}
                          values={[this.state.amountValueOne, this.state.amountValueTwo]}
                          sliderLength={fieldWidth}
                          selectedStyle={{
                            backgroundColor: Colors.themeColor,
                          }}
                          unselectedStyle={{
                            backgroundColor: Colors.themeColor,
                          }}
                          min={0}
                          max={3000}
                          step={1}
                          snapped
                          minMarkerOverlapDistance={0}
                          customMarker={() => <View style={{ ...styles.sliderThumb, width: 20, height: 20 }} />}
                          enableLabel
                          customLabel={() => <Text style={styles.textAboveCursor}>{`${this.state.amountValueOne}-${this.state.amountValueTwo}`}</Text>}
                        />
                      </View>
                    </View>
                    <View style={[styles.filterRow, styles.width]}>
                      <View style={styles.row}>
                        <Switch />
                        <Diameter style={{ marginLeft: 15, color: Colors.themeColor }} />
                        <Text style={{ marginLeft: 10, ...styles.itemText }}>Diameter</Text>
                      </View>
                      <View style={styles.marginLeft}>
                        <MultiSlider
                          onValuesChange={(values) => {
                            this.setState({ diameterValueOne: values[0], diameterValueTwo: values[1] });
                          }}
                          allowOverlap={false}
                          valueSuffix="mm"
                          values={[
                            this.state.diameterValueOne,
                            this.state.diameterValueTwo,
                          ]}
                          sliderLength={fieldWidth}
                          selectedStyle={{
                            backgroundColor: Colors.themeColor,
                          }}
                          unselectedStyle={{
                            backgroundColor: Colors.themeColor,
                          }}
                          min={2}
                          max={10}
                          step={1}
                          snapped
                          minMarkerOverlapDistance={0}
                          customMarker={() => <View style={{ ...styles.sliderThumb, width: 20, height: 20 }} />}
                          enableLabel
                          customLabel={() => <Text style={styles.textAboveCursor}>{`${this.state.diameterValueOne}mm-${this.state.diameterValueTwo}mm`}</Text>}
                        />
                      </View>
                    </View>
                    <View style={[styles.filterRow, styles.width]}>
                      <View style={styles.row}>
                        <Switch />
                        <Length style={{ marginLeft: 15, color: Colors.themeColor }} />
                        <Text style={{ marginLeft: 15, ...styles.itemText }}>Length</Text>
                      </View>
                      <View style={styles.marginLeft}>
                        <MultiSlider
                          onValuesChange={(values) => {
                            this.setState({ lengthValueOne: values[0], lengthValueTwo: values[1] });
                          }}
                          allowOverlap={false}
                          valueSuffix="mm"
                          values={[
                            this.state.lengthValueOne,
                            this.state.lengthValueTwo,
                          ]}
                          sliderLength={fieldWidth}
                          selectedStyle={{
                            backgroundColor: Colors.themeColor,
                          }}
                          unselectedStyle={{
                            backgroundColor: Colors.themeColor,
                          }}
                          min={2}
                          max={54}
                          step={1}
                          snapped
                          minMarkerOverlapDistance={0}
                          customMarker={() => <View style={{ ...styles.sliderThumb, width: 20, height: 20 }} />}
                          enableLabel
                          customLabel={() => <Text style={styles.textAboveCursor}>{`${this.state.lengthValueOne}mm-${this.state.lengthValueTwo}mm`}</Text>}
                        />
                      </View>
                    </View>
                    <View style={[styles.filterRow, styles.width, {
                      marginTop: 15
                    }]}>
                      <View style={styles.row}>
                        <Switch />
                        <Gender style={{ marginLeft: 15, color: Colors.themeColor }} />
                        <Text style={{ marginLeft: 15, ...styles.itemText }}>Gender</Text>
                      </View>
                      <View style={styles.selectOptions}>
                        <SelectValue changeValue={this.changeGenderValue} checked={this.gender} text="Female" />
                        <SelectValue changeValue={this.changeGenderValue} checked={this.gender} text="Male" />
                        <SelectValue changeValue={this.changeGenderValue} checked={this.gender} text="Both" />
                      </View>
                    </View>

                    <View style={[styles.filterRow, styles.width, {
                      marginTop: 25
                    }]}>
                      <View style={styles.row}>
                        <Switch />
                        <Jaw style={{ marginLeft: 15, color: Colors.themeColor }} />
                        <Text style={{ marginLeft: 15, ...styles.itemText }}>Jaw</Text>
                      </View>
                      <View style={styles.selectOptions}>
                        <SelectValue changeValue={this.changeJawValue} checked={this.jaw} text="Upper" />
                        <SelectValue changeValue={this.changeJawValue} checked={this.jaw} text="Lower" />
                        <SelectValue changeValue={this.changeJawValue} checked={this.jaw} text="Both" />
                      </View>
                    </View>

                    <View style={[{ marginTop: 30, justifyContent: "center" }, styles.width]}>
                      <View style={styles.row}>
                        <Switch />
                        <MedicalCondition style={{ marginLeft: 15, color: Colors.themeColor }} />
                        <Text style={{ marginLeft: 15, ...styles.itemText }}>Medical Condition</Text>
                      </View>
                      <View style={{
                        marginLeft: 40,
                        marginTop: 10,
                      }}>
                        {medicalConditions && medicalConditions.map((val: any, index: any) =>
                          <CheckBox
                            key={index}
                            title={val.name}
                            containerStyle={{ padding: 0, backgroundColor: undefined, borderColor: "transparent" }}
                            textStyle={styles.checkboxText}
                            checkedIcon={<Checked />}
                            uncheckedIcon={<Unchecked />}
                            checked={this.state.checkedMedicalConditions.indexOf(val.id) === -1 ? false : true}
                            onPress={() => {
                              const checkedMedicalConditions = [...this.state.checkedMedicalConditions];
                              const index = checkedMedicalConditions.indexOf(val.id);
                              if (index === -1) {
                                checkedMedicalConditions.push(val.id);
                              } else {
                                checkedMedicalConditions.splice(index, 1);
                              }
                              this.setState({ checkedMedicalConditions });
                            }
                            }
                          />
                        )}
                      </View>
                    </View>
                  </View>
                }
              </ScrollView>
              <View style={{ height: 70 }}>
                <LinearGradient
                  colors={[Colors.whiteColor, '#e8e8e8']}
                  style={styles.footerLinearGradient}>
                  <View style={styles.footer}>
                    <TouchableOpacity onPress={this.goBack} style={[styles.footerContent, {
                      paddingLeft: 10, alignItems: 'center',
                    }]}><Text style={styles.back}>{I18n.t('back')}</Text></TouchableOpacity>
                    <TouchableOpacity style={[styles.footerContent, {
                      paddingLeft: '10%', alignItems: 'center',
                    }]} onPress={this.onReset}>
                      <Reset />

                    </TouchableOpacity>
                    <TouchableOpacity style={isLoading ? [styles.footerContent, styles.loaderContainer] : styles.footerContent} onPress={this.onFilter}>
                      {isLoading ? <ActivityIndicator color={Colors.whiteColor} size="small" /> : <ApplyFilter />}
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>
            </LinearGradient>
          </View >
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
    paddingTop: Platform.OS === 'android' ? getStatusBarHeight() : 0,
  },
  selectionOptionsItemText: {
    fontFamily: "Roboto",
    fontSize: 14,
    fontWeight: "300",
    padding: 5,
    color: Colors.blueColor
  },
  selectOptionsItem: {
    borderRadius: 10,
    flex: 1,
  },
  filterRow: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: 'row',
    width: '70%'
  },

  width: {
    width: '90%'
  },

  selectOptions: {
    width: fieldWidth,
    flexDirection: "row",
    backgroundColor: "#e3e3e3",
    borderRadius: 10,
    justifyContent: "space-evenly"
  },
  contentView: {
    width: '100%',
    alignItems: 'center',
  },
  checkboxText: {
    fontFamily: "System",
    fontSize: 14,
    textAlign: "left",
    color: Colors.blueColor,
    fontWeight: "300"
  },
  textAboveCursor: {
    opacity: 0.5,
    fontFamily: "System",
    fontSize: 12,
    textAlign: "center",
    color: Colors.blueColor,
    marginBottom: -10
  },
  textAboveTheSlider: {
    opacity: 0.5,
    fontFamily: "System",
    fontSize: 14,
    textAlign: "center",
    color: Colors.blueColor
  },
  sliderThumb: {
    backgroundColor: Colors.themeColor,
    borderRadius: 0,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6
  },
  mainText: {
    fontFamily: "System",
    fontSize: 14,
    textAlign: "left",
    color: Colors.whiteColor,
    marginLeft: 15,
    marginTop:0,
    marginBottom: 10
  },
  linearGradient: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.23,
    shadowRadius: 10,
    elevation: 4,
  },
  contentContainer: {
    marginTop: 15,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    marginBottom: 32
  },
  row: {
    flexDirection: "row"
  },
  itemText: {
    fontFamily: "System",
    fontSize: 14,
    fontWeight: "300",
    textAlign: "left",
    color: Colors.blueColor
  },
  divider: {
    width: '90%',
    borderBottomWidth: 1,
    borderColor: 'rgba(43, 143, 255, 0.2)',
    borderStyle: 'solid',
    marginTop: 20,
    marginBottom: 20
  },
  footerContent: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  footer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
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
  back: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '300',
    fontStyle: 'normal',
    textAlign: 'center',
    color: Colors.blueColor,
    paddingLeft: 15
  },
  label: {
    textAlign: "center",
    opacity: 0.6,
    fontFamily: "Roboto",
    fontSize: fontRatio(14),
    color: Colors.blueColor,
    paddingVertical: 0,
    marginRight: 0
  },
  picker: {
    marginLeft: 0,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    width: Dimensions.get('window').width * 0.35,
  },
  marginLeft: {
    marginLeft: '10%'
  },
  loaderContainer: {
    backgroundColor: Colors.lightGreenColor,
    width: 160,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    alignSelf: 'center',
    marginRight: 22,
    flex: 0.8
  }
});


const mapStateToProps = (state: { constants: { medicalConditions: any; manufactures: any; }; statistics: { isLoading: any; filterOptions: any }; }) => ({
  medicalConditions: state.constants.medicalConditions,
  manufactures: state.constants.manufactures,
  isLoading: state.statistics.isLoading,
  filterOptions: state.statistics.filterOptions
});
export default connect(mapStateToProps, {
  getImplantStatistics: visitActions.getImplantStatistics,
  getMedicalConditions: userActions.getMedicalConditions,
  getManufactures: userActions.getManufactures,
})(StatisticsFilter);