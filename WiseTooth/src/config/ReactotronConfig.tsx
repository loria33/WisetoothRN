import Reactotron from 'reactotron-react-native';
import {reactotronRedux} from 'reactotron-redux';
import apisaucePlugin from 'reactotron-apisauce';
import sagaPlugin from 'reactotron-redux-saga';
import Config from '.';
// , host: '192.168.1.202'
if (Config.useDev) {
  Reactotron.configure({name: 'React App', host: '192.168.1.7'})
    .useReactNative()
    .use(reactotronRedux())
    .use(apisaucePlugin())
    .use(sagaPlugin({}));
  Reactotron.connect();
  Reactotron.clear();
  // @ts-ignore
  console.tron = Reactotron;
} else {
  // @ts-ignore
  console.tron = {warn: () => {}, log: () => {}};
}
export default Reactotron;
