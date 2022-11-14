
import { Dimensions, PixelRatio } from 'react-native';

interface StylesTypes {
    //placeholderStyle: TextStyle;
    //placeholderStyle: ViewStyle;
}

const Colors = {
    themeColor: "#2b8fff",
    blueColor: "#00417c",
    whiteColor: "#ffffff",
    lightGrayColor: "#fcfcfc",
    grayColor: "#e3e3e3",
    wisetoothGray: "#e8e8e8",
    lightGreenColor: "#00ccd4"
}


const Styles: StylesTypes = {
}


const getScreenWidth = () => {
    const { width } = Dimensions.get('window');
    return width;
}

const scale = getScreenWidth() / 411;

const fontRatio = (value: any) => {
    return Math.round(PixelRatio.roundToNearestPixel(scale * value))
};

export {
    Colors,
    Styles,
    fontRatio
};
