
import React, {Component,Fragment} from 'react';
import { Platform } from "react-native";
import {View, Text, StyleSheet, StatusBar, Dimensions, Image, ScrollView, Alert,SafeAreaView} from 'react-native';
import I18n from '../../l18n/I18n';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Colors } from '../../styles/StyleSheet';
import Header from '../../components/Header';
import { StackNavigationProp } from '@react-navigation/stack';
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
// @ts-ignore
import CameraCircle from '../../../assets/images/cameraCircle.svg';
// @ts-ignore
import NextOff14 from '../../../assets/images/nextOff14.svg';
// @ts-ignore
import NextOn14 from '../../../assets/images/nextOn14.svg';
// @ts-ignore
import Teeth from '../../../assets/images/teeth.svg';
import LinearGradient from 'react-native-linear-gradient';
import ITGImageSwiper from '../../components/ITGImageSwiper';
import { extractLabel } from '../../api/user';
import { CreateImplantParamList, ImplantImageData } from '../../Models/CreateImplantStackModel';
import Spinner from 'react-native-loading-spinner-overlay';
import { RouteProp } from '@react-navigation/native';
import ImageResizer from 'react-native-image-resizer';
import ImageEditor from "@react-native-community/image-editor";
// import CameraRoll from "@react-native-community/cameraroll";
import { getStatusBarHeight} from 'react-native-status-bar-height';
interface ScanImplantProps {
  navigation: StackNavigationProp<CreateImplantParamList, "ScanImplant">
  route: RouteProp<CreateImplantParamList, "ScanImplant">;
}
import { launchImageLibrary} from 'react-native-image-picker';


interface ScanImplantState {
  photo: string | undefined;
  implants: ImplantImageData[];
  loading: boolean;
  showAnimatedLine: boolean;
  cameraDisabled: boolean;
}

class ScanImplant extends Component<ScanImplantProps, ScanImplantState> {
  focusListener: any;
  private camera: RNCamera | null;
  constructor(props: any) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.goBack = this.goBack.bind(this);
    this.camera = null;
    this.state = {
      photo: "",
      implants: this.props.route.params?.implants ? this.props.route.params.implants : [],
      loading: false,
      cameraDisabled: false,
      showAnimatedLine: true,
    }
  }

  onSubmit() {
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('focus', this.resetImplants)
  }

  componentWillUnmount() {
    this.focusListener();
  }

  goBack() {
    if (this.state.photo) {
      this.resetImplants();
    } else {
      this.props.navigation.goBack();
    }
    this.setState({ showAnimatedLine:true });
  }

  resetImplants = () => {
    this.setState({
      photo: '',
      implants: this.props.route.params?.implants ? this.props.route.params.implants : []
    })

    this.setState({ showAnimatedLine:true });
  }

  resumeVideoCapture = () => {
    this.camera?.resumePreview()
    this.setState({ showAnimatedLine:true });
  }

  pauseVideoCapture = () => {
    this.camera?.pausePreview()
    this.setState({ showAnimatedLine:false });
  }

  takePicture = async () => {
    if (this.camera) {
      const data = await this.camera.takePictureAsync();//
     
        this.setState({ loading: true, cameraDisabled: false });
      this.pauseVideoCapture()

      
      ImageResizer.createResizedImage(data.uri, 1000, 1000, 'JPEG', 70)
        .then(resizedImage => {
          
          const cropData = {
            offset: {
              x: 50,
              y: 150,
            },
            size: {
              width: resizedImage.width - 150 ,
              height: resizedImage.height  - 250,
            },
          };
          ImageEditor.cropImage(resizedImage.uri, cropData).then(cropedImage => {
            extractLabel(cropedImage).then(async (val: any) => {
              const valJson = await val.json();
              if (valJson.implantLabel && valJson.implantLabel !== "pending") {
                this.setState({ loading: false, cameraDisabled: false });
                const implants = [...this.state.implants];
                implants.push({
                  implantLabel: valJson.implantLabel,
                  implantLabelId: valJson.implantLabelId,
                  ManufacturerModel: valJson.ManufacturerModel,
                  new: valJson.new,
                  diameter: valJson.diameter,
                  length: valJson.length,
                  lot: valJson.lot,
                  installId: valJson.installId,
                  hasFailure: valJson.hasFailure,
                  toothNumList: typeof valJson.toothNum === 'string' ?
                    valJson.toothNum.split(',') : []
                } as ImplantImageData);
                this.setState({ photo: cropedImage, implants });
              } else if (valJson.error) {
                this.setState({ loading: false, cameraDisabled: false });
                setTimeout(() => {
                  Alert.alert('', valJson.error, [
                    {
                      text: 'OK', onPress: this.resumeVideoCapture,
                    },
                  ]);
                }, 100);
              } else if (valJson.implantLabel === "pending") {
                this.setState({ loading: false, cameraDisabled: false });
                const implants = [...this.state.implants];
                implants.push({
                  implantLabel: "Pending",
                  implantLabelId:valJson.implantLabelId,
                  ManufacturerModel: valJson.ManufacturerModel,
                  new: valJson.new,
                  diameter: valJson.diameter,
                  length: valJson.length,
                  lot: valJson.lot,
                  installId: valJson.installId,
                  hasFailure: valJson.hasFailure,
                  toothNumList: typeof valJson.toothNum === 'string' ?
                    valJson.toothNum.split(',') : []
                } as ImplantImageData);
                this.setState({ photo: cropedImage, implants });
              } else {
                this.setState({ loading: false, cameraDisabled: false });
                setTimeout(() => {
                  Alert.alert('', I18n.t('extractError'), [
                    {
                      text: 'OK', onPress: this.resumeVideoCapture,
                    },
                  ]);
                }, 100);
              }
            }, () => {
              this.setState({ loading: false, cameraDisabled: false });
              setTimeout(() => {
                Alert.alert('', 'Please check your internet connection', [
                  {
                    text: 'OK', onPress: this.resumeVideoCapture,
                  },
                ]);
              }, 100);

            }).catch((err) => {
              this.setState({ loading: false, cameraDisabled: false });
              setTimeout(() => {
                Alert.alert('', JSON.stringify(err), [
                  {
                    text: 'OK', onPress: this.resumeVideoCapture,
                  },
                ]);
              }, 100);
            });
            // response.uri is the URI of the new image that can now be displayed, uploaded...
            // response.path is the path of the new image
            // response.name is the name of the new image with the extension
            // response.size is the size of the new image
          })
            .catch(err => {
              this.setState({ loading: false, cameraDisabled: false });
            });

        })
    }
  };

  choosePicFromLib = async () => {
    if (this.camera) {
      const data = await launchImageLibrary({
        includeBase64: true,
        mediaType: 'photo',
      });
     
      const datURI = data && data.assets && data.assets.length > 0?data.assets[0].uri:" "
      this.setState({ loading: true, cameraDisabled: false });
      this.pauseVideoCapture()

      
      ImageResizer.createResizedImage(datURI?datURI:" ", 1000, 1000, 'JPEG', 70)
        .then(resizedImage => {
          
          const cropData = {
            offset: {
              x: 50,
              y: 150,
            },
            size: {
              width: resizedImage.width - 150 ,
              height: resizedImage.height  - 250,
            },
          };
          ImageEditor.cropImage(resizedImage.uri, cropData).then(cropedImage => {
            extractLabel(cropedImage).then(async (val: any) => {
              const valJson = await val.json();
              if (valJson.implantLabel && valJson.implantLabel !== "pending") {
                this.setState({ loading: false, cameraDisabled: false });
                const implants = [...this.state.implants];
                implants.push({
                  implantLabel: valJson.implantLabel,
                  implantLabelId: valJson.implantLabelId,
                  ManufacturerModel: valJson.ManufacturerModel,
                  new: valJson.new,
                  diameter: valJson.diameter,
                  length: valJson.length,
                  lot: valJson.lot,
                  installId: valJson.installId,
                  hasFailure: valJson.hasFailure,
                  toothNumList: typeof valJson.toothNum === 'string' ?
                    valJson.toothNum.split(',') : []
                } as ImplantImageData);
                this.setState({ photo: cropedImage, implants });
              } else if (valJson.error) {
                this.setState({ loading: false, cameraDisabled: false });
                setTimeout(() => {
                  Alert.alert('', valJson.error, [
                    {
                      text: 'OK', onPress: this.resumeVideoCapture,
                    },
                  ]);
                }, 100);
              } else if (valJson.implantLabel === "pending") {
                this.setState({ loading: false, cameraDisabled: false });
                const implants = [...this.state.implants];
                implants.push({
                  implantLabel: "Pending",
                  implantLabelId:valJson.implantLabelId,
                  ManufacturerModel: valJson.ManufacturerModel,
                  new: valJson.new,
                  diameter: valJson.diameter,
                  length: valJson.length,
                  lot: valJson.lot,
                  installId: valJson.installId,
                  hasFailure: valJson.hasFailure,
                  toothNumList: typeof valJson.toothNum === 'string' ?
                    valJson.toothNum.split(',') : []
                } as ImplantImageData);
                this.setState({ photo: cropedImage, implants });
              } else {
                this.setState({ loading: false, cameraDisabled: false });
                setTimeout(() => {
                  Alert.alert('', I18n.t('extractError'), [
                    {
                      text: 'OK', onPress: this.resumeVideoCapture,
                    },
                  ]);
                }, 100);
              }
            }, () => {
              this.setState({ loading: false, cameraDisabled: false });
              setTimeout(() => {
                Alert.alert('', 'Please check your internet connection', [
                  {
                    text: 'OK', onPress: this.resumeVideoCapture,
                  },
                ]);
              }, 100);

            }).catch((err) => {
              this.setState({ loading: false, cameraDisabled: false });
              setTimeout(() => {
                Alert.alert('', JSON.stringify(err), [
                  {
                    text: 'OK', onPress: this.resumeVideoCapture,
                  },
                ]);
              }, 100);
            });
            // response.uri is the URI of the new image that can now be displayed, uploaded...
            // response.path is the path of the new image
            // response.name is the name of the new image with the extension
            // response.size is the size of the new image
          })
            .catch(err => {
              this.setState({ loading: false, cameraDisabled: false });
            });

        })
    }
  };

  
   onFinderLayoutMeasured = ({nativeEvent}) => {
    console.log('height:', nativeEvent.layout.height);
    console.log('width:', nativeEvent.layout.width);
    console.log('x:', nativeEvent.layout.x);
    console.log('y:', nativeEvent.layout.y);
  }

  render() {
    let width = Dimensions.get("window").width * 0.9;
    let height = width;
    return (
     <Fragment >
      <SafeAreaView style={styles.saveAreaBackgrounColor} />
      <SafeAreaView style={styles.saveAreaView}>
      <View style={styles.mainContainer}>
        <StatusBar translucent backgroundColor={Colors.whiteColor} barStyle="light-content" />
        <Header title={"Implant's Label"} navigation={this.props.navigation} style={{ paddingBottom: 10 }}/>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.contentContainer}>
            {!this.state.photo && <View style={styles.textContainer}>
              <Text style={styles.label}> Scan the implant's label with your camera.</Text>
              <Text style={styles.label}> Make sure the picture is focused and readable.</Text>
            </View>}
            <View style={styles.cameraContainer}>
              {this.state.photo ?
                <ITGImageSwiper onClose={this.resetImplants}>
                  <Image source={{ uri: this.state.photo }} style={{ width, height, borderRadius: 12 }} />
                </ITGImageSwiper>
                :

                <RNCamera
                  ref={ref => {
                    this.camera = ref;
                  }}
                  captureAudio={false}
                  style={{ width, height }}
                  ratio={"1:1"}
                  type={RNCamera.Constants.Type.back}
                  flashMode={RNCamera.Constants.FlashMode.auto}
                  defaultVideoQuality={RNCamera.Constants.VideoQuality["720p"]}
                  autoFocus={RNCamera.Constants.AutoFocus.on}
                  playSoundOnCapture={true}
                  androidCameraPermissionOptions={{
                    title: 'Permission to use camera',
                    message: 'We need your permission to use your camera',
                    buttonPositive: 'Ok',
                    buttonNegative: 'Cancel',
                  }}
                  onGoogleVisionBarcodesDetected={({ barcodes }) => {
                  }}
                >
                  { this.state.showAnimatedLine && 
                  <BarcodeMask outerMaskOpacity={0.4} edgeColor={Colors.themeColor} showAnimatedLine={true} onLayoutMeasured={this.onFinderLayoutMeasured}/>                  
                  } 
                 
                </RNCamera>

              }
            </View>
            {this.state.photo ?
              <View style={{ flex: 3, marginTop: 10 }}>
                <Text style={{ ...styles.label }}>Swipe the photo to the left in order to discard it and take a new one. </Text>
                <View style={{ flexDirection: "row", flex: 1, flexWrap: "wrap" }}>
                  {this.state.implants.map((implant, index) => {
                    return (<View style={styles.toothContainer} key={index}>
                      <Teeth width={12} height={13} style={{ marginTop: 5, marginHorizontal: 3 }} />
                      <Text style={{ fontFamily: "Roboto", fontSize: 16, color: Colors.whiteColor }}>{implant.implantLabel}</Text>
                    </View>)
                  })}
                </View>
              </View> :
              <>
              
              <TouchableOpacity disabled={this.state.cameraDisabled} style={styles.cameraButton} onPress={this.takePicture.bind(this)}>
                <CameraCircle />
              </TouchableOpacity>
              <View style={{justifyContent:'center',alignItems:'center'}}>
                <TouchableOpacity style={{justifyContent:'center',alignItems:'center'}} onPress={this.choosePicFromLib.bind(this)}>
                <View style={{marginBottom:20}}>
                <Text style={{fontWeight:'600'}}>OR</Text>
                  </View>
                  <View style={{borderBottomWidth:1,borderBottomColor:'blue'}}>
                  <Text style={{fontWeight:'600',color:'blue'}}>Upload from Library</Text>
                  </View>
               
                </TouchableOpacity>
              </View>
              </>}

            <View style={{ flex: 1, justifyContent: "flex-end" }}>
              <LinearGradient colors={[Colors.whiteColor, '#e8e8e8']} style={[styles.bottomsRow, styles.shadow]}>
                <TouchableOpacity onPress={this.goBack}>
                  <Text style={styles.back}> {I18n.t("back")} </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  if (this.state.photo) {
                    const photo = this.state.photo;
                    this.setState({ photo: "" }, () => {
                      this.props.navigation.navigate("SelectToothNumber", {
                        ...this.props.route.params,
                        implants: this.state.implants,
                        implantPhoto: this.props.route.params?.implantPhoto ? this.props.route.params.implantPhoto : photo
                      });
                    });
                  }
                }}>
                  {this.state.photo ? <NextOn14 /> : <NextOff14 />}
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </ScrollView>
        <Spinner
          visible={this.state.loading}
          textStyle={styles.spinnerTextStyle}
        />          
        </View>
         </SafeAreaView>
         </Fragment>
    );
  }
}

const width = Dimensions.get("window").width;
const height = width;

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
  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  rectangle: {
    borderLeftColor: 'rgba(0, 0, 0, .0)',
    borderRightColor: 'rgba(0, 0, 0, .0)',
    borderTopColor: 'rgba(0, 0, 0, .0)',
    borderBottomColor: 'rgba(0, 0, 0, .0)',
    borderLeftWidth: width,
    borderRightWidth: width,
    borderTopWidth: height,
    borderBottomWidth: height
  },
  rectangleColor: {
    height: 250,
    width: 250,
    backgroundColor: 'transparent'
  },
  topLeft: {
    width: 50,
    height: 50,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    position: 'absolute',
    left: -20,
    top: 20,
    borderLeftColor: Colors.themeColor,
    borderTopColor: Colors.themeColor
  },
  topRight: {
    width: 50,
    height: 50,
    borderTopWidth: 2,
    borderRightWidth: 2,
    position: 'absolute',
    right: -20,
    top: 20,
    borderRightColor: Colors.themeColor,
    borderTopColor: Colors.themeColor
  },
  bottomLeft: {
    width: 50,
    height: 50,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    position: 'absolute',
    left: -20,
    bottom: 20,
    borderLeftColor: Colors.themeColor,
    borderBottomColor: Colors.themeColor
  },
  bottomRight: {
    width: 50,
    height: 50,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    position: 'absolute',
    right: -20,
    bottom: 20,
    borderRightColor: Colors.themeColor,
    borderBottomColor: Colors.themeColor
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: "column",
  },
  label: {
    fontFamily: "Roboto",
    fontSize: 14,
    color: "#00417c",
    width: "100%",
    paddingHorizontal: "5%",
  },
  textContainer: {
    marginTop: "2%",
  },
  cameraContainer: {
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: "2%",
  },
  toothContainer: {
    backgroundColor: Colors.themeColor,
    flexDirection: "row",
    alignSelf: 'baseline',
    marginLeft: "5%",
    padding: 4,
    marginTop: 10,
  },
  cameraButton: {
    marginTop: "5%",
    flexDirection: 'row',
    justifyContent: 'center',
  },
  bottomsRow: {
    backgroundColor: "red",
    width: "100%",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
    //alignSelf: "flex-end",
    height: 85,
    //paddingBottom: -10
    //flexGrow: 0
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,
    elevation: 24,
  },
  back: {
    fontFamily: "Roboto",
    fontSize: 14,
    fontWeight: "300",
    textAlign: "center",
    color: Colors.blueColor,
    marginTop: 30,
    marginLeft: 25
  }
});


export default ScanImplant;
