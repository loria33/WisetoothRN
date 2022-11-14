import React, { Component } from 'react';
import { View, StyleSheet, Text, ViewStyle } from 'react-native';
import { TouchableOpacity, FlatList } from 'react-native-gesture-handler';
import { Divider, Icon } from 'react-native-elements';
import { Colors } from '../styles/StyleSheet';
import { PickerModel } from '../Models/GeneralModels';
import { FormikErrors, FormikTouched } from 'formik';

interface PickerProps {
  fieldName: string;
  value: string;
  errorMessage: string | string[] | FormikErrors<any> | FormikErrors<any>[] | undefined;
  label: string;
  useIdAsATheValue: boolean;
  setFieldValue: (value: string, text: string) => void;
  touched: boolean | FormikTouched<any> | FormikTouched<any>[] | undefined;
  getSpecialities?: () => Promise<PickerModel[]>;
  hideOverlappingViews?: (func?: () => void) => void;
  onDropdownOpen?: () => void;
  SvgIcon?: any;
  style?: any;
  onRef?: (ref: any) => void;
  options?: any;
  labelStyle?: any;
  lastView?: boolean;
  pickerStyle?: any;
  resetMode?: boolean;
  innerValue?: string;
}

interface PickerState {
  showMenu: boolean;
  value: string;
  options: PickerModel[];
}

const getColor = (errorMessage: string | string[] | FormikErrors<any> | FormikErrors<any>[] | undefined, touched: boolean | FormikTouched<any> | FormikTouched<any>[] | undefined) =>
  (errorMessage && touched ? '#eb4859' : Colors.themeColor);

class Picker extends Component<PickerProps, PickerState> {

  constructor(props: PickerProps) {
    super(props);
    this.state = {
      showMenu: false,
      value: this.props.value,
      options: []
    };
    this.showPickerMenu = this.showPickerMenu.bind(this);
    this._renderItem = this._renderItem.bind(this);
    this._keyExtractor = this._keyExtractor.bind(this)
  }

  showPickerMenu() {
    this.props.hideOverlappingViews && this.props.hideOverlappingViews();
    this.props.onDropdownOpen && this.props.onDropdownOpen();
    this.setState({ showMenu: !this.state.showMenu });
  }

  _renderItem({ item }: any) {
    return (
      <TouchableOpacity onPress={async () => {
        if (this.props.useIdAsATheValue) {
          await this.props.setFieldValue(this.props.fieldName, item.id);
        } else {
          await this.props.setFieldValue(this.props.fieldName, item.name);
        }
        this.setState({ value: item.name });
        this.showPickerMenu();
      }} style={{ flex: 1 }}>
        <Text style={{ ...styles.pickerText, opacity: 1, fontSize: 14 }}> {item.name} </Text>
      </TouchableOpacity>
    );
  }

  _keyExtractor(item: string, index: number): string {
    return `${index}`;
  }

  renderSeparator = () => {
    return <Divider style={styles.divider} />;
  };

  render() {
    const heightAfterOpening = Math.min(180, this.state.options && this.state.options.length * 37);
    const { SvgIcon, style, touched, errorMessage, labelStyle, label, pickerStyle, lastView, value, resetMode, innerValue } = this.props;
    return (
      <View style={[styles.mainContainer, style ? style : {}, this.state.showMenu && lastView ? { height: 62 + heightAfterOpening } : {}]}>
        <View style={[styles.container, styles.borderStyle, { borderColor: getColor(this.props.errorMessage, this.props.touched), height: 30 }]}>
          {SvgIcon && <SvgIcon width={20} height={20} style={{ color: getColor(this.props.errorMessage, this.props.touched) }} />}
          <TouchableOpacity onPress={this.showPickerMenu} style={[{ marginLeft: SvgIcon ? 0 : "50%" }, pickerStyle]}>
            <Text
              style={[styles.value, labelStyle, {
                opacity: (resetMode && !value) || !this.state.value ? 0.6 : 1
              }]}> {(resetMode && !value) || !this.state.value ?
                label : (innerValue || this.state.value)}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.showPickerMenu}>
            <Icon name={"keyboard-arrow-down"} type={"material"} size={20} color={getColor(this.props.errorMessage, this.props.touched)} />
          </TouchableOpacity>
        </View>
        {!this.state.showMenu && <View style={styles.errorContainer}>
          {touched && errorMessage && <Text style={styles.error}>{this.props.errorMessage}</Text>}
        </View>}
        {this.state.showMenu && <FlatList
          style={[styles.dropdownMenu, { height: heightAfterOpening }]}
          // @ts-ignore
          data={this.state.options}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={this.renderSeparator}
        />}
      </View>
    );
  }

  async componentDidMount() {
    const { options, getSpecialities } = this.props;
    this.props.onRef && this.props.onRef({ open: this.showPickerMenu });
    const specialities = getSpecialities ? await getSpecialities() : options;
    this.setState({ options: specialities });
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    height: 62,
    flexDirection: "column",
    justifyContent: "space-between",
    paddingBottom: 5,
    zIndex: 10,
  },
  container: {
    height: 50,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingBottom: 5,
    marginBottom: 10
  },
  borderStyle: {
    //flex: 1,
    borderBottomWidth: 1,
  },
  pickerText: {
    //width: "100%",
    textAlign: "center",
    opacity: 0.6,
    fontFamily: "Roboto",
    fontSize: 14,
    color: Colors.blueColor,
    paddingVertical: 8,
  },
  value: {
    textAlign: "center",
    opacity: 0.6,
    fontFamily: "Roboto",
    fontSize: 14,
    color: Colors.blueColor,
    paddingVertical: 2,
    marginRight: 20
  },
  dropdownMenu: {
    width: "100%",
    zIndex: 20,
    top: 28,
    position: "absolute",
    backgroundColor: "#ffffff",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.themeColor,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    //elevation:5
  },
  divider: {
    backgroundColor: '#e8e8e8',
    height: 1
  },
  error: {
    color: '#eb4859',
    fontSize: 12,
  },
  errorContainer: {
    //paddingTop: 10,
    height: 12,
    width: '80%',
  }
});

export default Picker;
