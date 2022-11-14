import { ViewStyle, TextStyle, Platform } from "react-native";
import { Colors } from '../../styles/StyleSheet';
import { getStatusBarHeight} from 'react-native-status-bar-height';

interface StylesTypes {
    placeholderStyle: TextStyle;
    container: ViewStyle;
    inputsContainer: ViewStyle;
    top: ViewStyle;
    down: ViewStyle;
    downView: ViewStyle;
    mainText: TextStyle;
    bottomsRow: ViewStyle;
    back: TextStyle;
    saveAreaBackgrounColor: ViewStyle;
    saveAreaView: ViewStyle;
}


const Styles: StylesTypes = {
    container: {
        flex: 1,
      },
      inputsContainer: {
        flex: 8
      },
      top: {
        backgroundColor: Colors.themeColor,
        flex: 0.4,
        alignItems: "center",
        justifyContent: "center",
      },
      down: {
        flex: 3,
        backgroundColor: Colors.themeColor,
        //paddingTop: 20
      },
      downView: {
        flex: 1,
        alignItems: "center",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: "rgba(0, 0, 0, 0.3)",
        shadowOffset: {
          width: 5,
          height: 15,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
      },
      mainText: {
        marginTop: 25,
        //flex: 1,
        width: "100%",
        textAlign: "center",
        fontFamily: "Roboto",
        fontSize: 15,
        color: Colors.blueColor,
      },
      placeholderStyle: {
        opacity: 0.6,
        fontFamily: "Roboto",
        fontSize: 12,
        fontWeight: "300",
        lineHeight: 1.08,
        color: Colors.blueColor
      },
      bottomsRow: {
        width: "100%",
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "space-between"
      },
      back: {
        fontFamily: "Roboto",
        fontSize: 14,
        fontWeight: "300",
        textAlign: "center",
        color: Colors.blueColor,
        marginTop: 25,
        marginLeft: 30
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
}

export  {
    Styles
};
