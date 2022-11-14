import React from 'react';
import { View, StyleSheet, Text ,StatusBar} from 'react-native';
import { Icon } from 'react-native-elements';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors } from '../styles/StyleSheet';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface HeaderProps {
  title: string;
  showEditIcon?: boolean;
  color?: string;
  navigation: StackNavigationProp<{
  }>;
  visit?: any;
  isEditPatientInfo? :boolean;
  style?: any;
}
class Header extends React.Component<HeaderProps> {
  onToggleDrawer = () => {
    this.props.navigation.toggleDrawer();
  };

  onEdit = () => {
    const {visit, isEditPatientInfo, navigation} = this.props;

    if (isEditPatientInfo) {
      navigation.navigate("CreateImplantPatientInformation", {visit})
    } else {
      if (visit) {
        const { report, id, toothNum, Implant } = visit.Installs[0];
        const answers = report && report.answers;
        const {
          surgeryInformationPlacement,
          sutureRemovalStageInformation,
          secondStageSurgeryInformation,
          prostheticStepsInformation,
          prostheticStageConfirmQuestion
        } = answers;
        navigation.navigate('ReportAFailure', {
          ...visit,
          date: visit.date,
          id,
          toothNum,
          serialNum: Implant.ImplantLabel && Implant.ImplantLabel.label,
          nextStageNumber: '5',
          surgeryInformationPlacement,
          sutureRemovalStageInformation,
          secondStageSurgeryInformation,
          prostheticStepsInformation,
          isEditMode: true,
          reportId: report && report.id,
          manufacturerModel:Implant.ImplantLabel &&
          Implant.ImplantLabel.ManufacturerModel,
          prostheticStageConfirmQuestion
        });
      }
    }
  }

  render() {
    const { title, showEditIcon, navigation, color, style } = this.props;
    return (
      <View style={[styles.header, style]}>
       <StatusBar translucent backgroundColor={Colors.themeColor} barStyle="light-content" />  
        {navigation && navigation.toggleDrawer && <View style={{width: '100%',paddingRight:0}}>
        <Text style={[styles.title, {
          color: color || Colors.whiteColor
        }]}>{title}</Text>
        </View>
        } 

        <View style={styles.titleContainer}>
        <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.title, {
          color: color || Colors.whiteColor
        }]}>{title}</Text>
        </View>

        {navigation && navigation.toggleDrawer && <View style={{position:"absolute",marginLeft:20 }}>
          <TouchableOpacity onPress={this.onToggleDrawer}>
            <Icon name="menu" size={30} color={color || Colors.whiteColor} />
          </TouchableOpacity>
        </View>
        }

        {showEditIcon && <View style={{position:"absolute",marginLeft:20 }}>
          <TouchableOpacity onPress={this.onEdit}>
            <Icon name="edit" size={30} color={Colors.whiteColor} />
          </TouchableOpacity>
        </View>}
    
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor:Colors.themeColor,
    flexDirection: "row",
    width: '100%',
    height:45,
    alignItems: "center",
    alignSelf:"center",
  },
  titleContainer: {
    width: '100%',
  },
  title: {
    fontFamily: 'System',
    fontSize: 20,
    marginLeft:60,
    marginRight:60,
    fontWeight: 'normal',
    fontStyle: 'normal',
    textAlign: 'center',
    alignItems: "center",
    alignSelf:"center",
    color: Colors.whiteColor,
  },
});

export default Header;
