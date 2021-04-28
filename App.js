import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppLoading from 'expo-app-loading';
import { Asset } from 'expo-asset';
import Constants from 'expo-constants';
import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
// Screens
import ImageScreen from './ImageScreen';
import MainScreen from './MainScreen';

const Stack = createStackNavigator();

// Instruct SplashScreen not to hide yet, we want to do this manually
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
	return (
		<NavigationContainer>
			<AnimatedAppLoader image={{ uri: Asset.fromModule(require('./assets/eureka.png')).uri }}>
				<Stack.Navigator initialRouteName='MainScreen' screenOptions={{ headerShown: true, headerTitleAlign: 'center', headerTintColor: 'white', headerStyle: { backgroundColor: '#449c69' } }}>
					<Stack.Screen name='ImageScreen' component={ImageScreen} options={{ title: 'EurekApp - Image' }} />
					<Stack.Screen name='MainScreen' component={MainScreen} options={{ title: 'EurekApp' }} />
				</Stack.Navigator>
			</AnimatedAppLoader>
		</NavigationContainer>
	);
}

function AnimatedAppLoader({ children, image }) {
	const [isSplashReady, setSplashReady] = React.useState(false);
	const startAsync = React.useMemo(() => () => Asset.fromModule(require('./assets/eureka.png')).uri, [image]);
	const onFinish = React.useMemo(() => setSplashReady(true), []);
	if (!isSplashReady) {
		return <AppLoading autoHideSplash={false} startAsync={startAsync} onError={console.error} onFinish={onFinish} />;
	}
	return <AnimatedSplashScreen image={image}>{children}</AnimatedSplashScreen>;
}

function AnimatedSplashScreen({ children, image }) {
	const animation = React.useMemo(() => new Animated.Value(1), []);
	const [isAppReady, setAppReady] = React.useState(false);
	const [isSplashAnimationComplete, setAnimationComplete] = React.useState(false);

	React.useEffect(() => {
		if (isAppReady) {
			Animated.timing(animation, {
				toValue: 0,
				duration: 200,
				useNativeDriver: true,
			}).start(() => setAnimationComplete(true));
		}
	}, [isAppReady]);

	const onImageLoaded = React.useMemo(() => async () => {
		try {
			await SplashScreen.hideAsync();
			await Promise.all([]);
		} catch (e) {
		} finally {
			setAppReady(true);
		}
	});

	return (
		<View style={{ flex: 1 }}>
			{isAppReady && children}
			{!isSplashAnimationComplete && (
				<Animated.View pointerEvents='none' style={[StyleSheet.absoluteFill, { backgroundColor: Constants.manifest.splash.backgroundColor, opacity: animation }]}>
					<Animated.Image style={{ width: '100%', height: '100%', resizeMode: Constants.manifest.splash.resizeMode || 'contain', transform: [{ scale: animation }] }} source={image} onLoadEnd={onImageLoaded} fadeDuration={0} />
				</Animated.View>
			)}
		</View>
	);
}
