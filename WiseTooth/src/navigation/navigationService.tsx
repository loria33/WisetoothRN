import {CommonActions} from '@react-navigation/native';
let _navigator: { dispatch: (arg0: CommonActions.Action) => void; };

function setTopLevelNavigator(nav: { dispatch: (arg0: CommonActions.Action) => void; }) {
  _navigator = nav;
}

function navigate(routeName: string, params?: any) {
  _navigator.dispatch(
    CommonActions.navigate({
      name: routeName,
      params: params || {},
    }),
  );
}

function goBack() {
  _navigator.dispatch(
    CommonActions.goBack()
  );
}

export default {
  navigate,
  setTopLevelNavigator,
  goBack
};
