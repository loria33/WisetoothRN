import React, { Component } from 'react';
import Login from '../containers/Login';
import Account from '../containers/Register/Account';
import AccountDetails from '../containers/Register/AccountDetails';
import ThankYou from '../containers/Register/ThankYou';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ImplantsStatistics from '../containers/ImplantsStatistics/ImplantsStatistics';
import StatisticsFilter from '../containers/ImplantsStatistics/StatisticsFilter';
import ImplantsList from '../containers/ImplantsList';
import DrawerContent from './DrawerContent';
import { connect } from 'react-redux';
import VerificationCode from '../containers/ForgotPassword/VerificationCode';
import ResetPassword from '../containers/ForgotPassword/ResetPassword';
import ForgotPassword from '../containers/ForgotPassword/ForgotPassword';
import ScanImplant from '../containers/CreateImplant/ScanImplant';
import SelectToothNumber from '../containers/CreateImplant/SelectToothNumber';
import CreateImplantPatientInformation from '../containers/CreateImplant/CreateImplantPatientInformation';
import CreateImplantSummary from '../containers/CreateImplant/CreateImplantSummary';
import NewImplant from '../containers/CreateImplant/NewImplant';
import navigationService from './navigationService';
import PatientInformation from '../containers/ImplantDetails/PatientInformation';
import SurgeryInformationPlacement from '../containers/ImplantDetails/SurgeryInformationPlacement';
import SutureRemovalStageInformation from '../containers/ImplantDetails/SutureRemovalStageInformation';
import SutureRemovalStage2Information from '../containers/ImplantDetails/SutureRemovalStage2Information';
import ProstheticStepsInformation from '../containers/ImplantDetails/ProstheticStepsInformation';
import ReportAFailure from '../containers/ReportAFailure/ReportAFailure';
import SurgeryInformationPlacementView from '../containers/ReportAFailure/SurgeryInformationPlacementView';
import SutureRemovalStageInformationView from '../containers/ReportAFailure/SutureRemovalStageInformationView';
import SecondStageSurgeryInformationView from '../containers/ReportAFailure/SecondStageSurgeryInformationView';
import ProstheticStepsInformationView from '../containers/ReportAFailure/ProstheticStepsInformationView';
import Statistics from '../containers/ImplantsStatistics/Statistics';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Account" component={Account} />
    <Stack.Screen
      name="AccountDetails"
      component={AccountDetails}
    />
    <Stack.Screen
      name="ForgotPassword"
      component={ForgotPassword}
    />
    <Stack.Screen
      name="VerificationCode"
      component={VerificationCode}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ResetPassword"
      component={ResetPassword}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ThankYou"
      component={ThankYou}
    />
  </Stack.Navigator>
);

const CreateImplantStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="ScanImplant">
    <Stack.Screen name="ScanImplant" component={ScanImplant} />
    <Stack.Screen name="SelectToothNumber" component={SelectToothNumber} />
    <Stack.Screen name="NewImplant" component={NewImplant} />
    <Stack.Screen name="CreateImplantPatientInformation" component={CreateImplantPatientInformation} />
    <Stack.Screen name="CreateImplantSummary" component={CreateImplantSummary} />
  </Stack.Navigator>
);

const DrawerStack = () => (
  <Drawer.Navigator
    initialRouteName="Implants Statistics"
    drawerType="front"
    drawerContent={(props) =>  <DrawerContent {...props} />}>
    <Drawer.Screen
      name="Implants Statistics"
      component={ImplantsStatistics}
    />
    <Drawer.Screen name="Implants List" component={ImplantsList} />
    <Drawer.Screen name="Create Implant" component={CreateImplantStack} />
  </Drawer.Navigator>
);

const AppStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
    }}
  >
    <Stack.Screen name="DrawerStack" component={DrawerStack} />
    <Stack.Screen name="StatisticsFilter" component={StatisticsFilter} />
    <Stack.Screen name="PatientInformation" component={PatientInformation} />
    <Stack.Screen name="CreateImplantPatientInformation" component={CreateImplantPatientInformation} />
    <Stack.Screen name="SurgeryInformationPlacement" component={SurgeryInformationPlacement} />
    <Stack.Screen name="SutureRemovalStageInformation" component={SutureRemovalStageInformation} />
    <Stack.Screen name="SutureRemovalStage2Information" component={SutureRemovalStage2Information} />
    <Stack.Screen name="ProstheticStepsInformation" component={ProstheticStepsInformation} />
    <Stack.Screen name="ReportAFailure" component={ReportAFailure} />
    <Stack.Screen name="SurgeryInformationPlacementView" component={SurgeryInformationPlacementView} />
    <Stack.Screen name="SutureRemovalStageInformationView" component={SutureRemovalStageInformationView} />
    <Stack.Screen name="SecondStageSurgeryInformationView" component={SecondStageSurgeryInformationView} />
    <Stack.Screen name="ProstheticStepsInformationView" component={ProstheticStepsInformationView} />
    <Stack.Screen name="Statistics" component={Statistics} />
  </Stack.Navigator>
);

interface RootNavigatorProps {
  isAuthenticated: boolean;
}
class RootNavigator extends Component<RootNavigatorProps> {
  render() {
    const { isAuthenticated } = this.props;
    return (
      <NavigationContainer ref={nav => {
        if (nav) {

          navigationService.setTopLevelNavigator(nav)
        }
      }}>
        {isAuthenticated ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
    );
  }
}

const mapStateToProps = (state: { auth: { isAuthenticated: any; }; }) => ({
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps, {})(RootNavigator);
