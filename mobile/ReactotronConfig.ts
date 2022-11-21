import AsyncStorage from '@react-native-async-storage/async-storage';
import Reactotron from 'reactotron-react-native';

// First, set some configuration settings on how to connect to the app
Reactotron.setAsyncStorageHandler(AsyncStorage);
Reactotron.configure({
	name: 'Demo App',
	// host: '10.0.1.1',
	port: 9090,
});

// add every built-in react native feature.  you also have the ability to pass
// an object as a parameter to configure each individual react-native plugin
// if you'd like.
Reactotron.useReactNative({
	asyncStorage: { ignore: ['secret'] },
});

// if we're running in DEV mode, then let's connect!
Reactotron.connect();
Reactotron.clear();

Reactotron.onCustomCommand('test', () =>
	console.tron.log('This is an example')
);

console.tron = Reactotron;
