import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppLoading from 'expo-app-loading';
import { Asset } from 'expo-asset';
import Constants from 'expo-constants';
import * as SplashScreen from 'expo-splash-screen';
import * as Updates from 'expo-updates';
import { Animated, Button, StyleSheet, Text, View } from 'react-native';
// Screens
import MainScreen from './MainScreen';
import ImageScreen from './ImageScreen';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

// Instruct SplashScreen not to hide yet, we want to do this manually
SplashScreen.preventAutoHideAsync().catch(() => {
	/* reloading the app might trigger some race conditions, ignore them */
});

export default function App() {
	return (
		<NavigationContainer>
			<AnimatedAppLoader image={{ uri: Asset.fromModule(require('./assets/eureka.png')).uri }}>
				<Stack.Navigator initialRouteName='MainScreen' screenOptions={{ headerShown: true, headerTitleAlign: 'center', headerStyle: { backgroundColor: 'mediumseagreen' } }}>
					<Stack.Screen name='ImageScreen' component={ImageScreen} options={{ title: 'EurekApp - Image' }} />
					<Stack.Screen name='MainScreen' component={MainScreen} options={{ title: 'EurekApp' }} />
					{/* <Stack.Screen name='Profile' component={ProfileScreen} /> */}
					{/* <MainScreen /> */}
				</Stack.Navigator>
			</AnimatedAppLoader>
		</NavigationContainer>
	);
}

function AnimatedAppLoader({ children, image }) {
	const [isSplashReady, setSplashReady] = React.useState(false);

	const startAsync = React.useMemo(
		// If you use a local image with require(...), use `Asset.fromModule`
		() => () => Asset.fromModule(require('./assets/eureka.png')).uri,
		[image]
	);

	const onFinish = React.useMemo(() => setSplashReady(true), []);

	if (!isSplashReady) {
		return (
			<AppLoading
				// Instruct SplashScreen not to hide yet, we want to do this manually
				autoHideSplash={false}
				startAsync={startAsync}
				onError={console.error}
				onFinish={onFinish}
			/>
		);
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
			// Load stuff
			await Promise.all([]);
		} catch (e) {
			// handle errors
		} finally {
			setAppReady(true);
		}
	});

	return (
		<View style={{ flex: 1 }}>
			{isAppReady && children}
			{!isSplashAnimationComplete && (
				<Animated.View
					pointerEvents='none'
					style={[
						StyleSheet.absoluteFill,
						{
							backgroundColor: Constants.manifest.splash.backgroundColor,
							opacity: animation,
						},
					]}>
					<Animated.Image
						style={{
							width: '100%',
							height: '100%',
							resizeMode: Constants.manifest.splash.resizeMode || 'contain',
							transform: [
								{
									scale: animation,
								},
							],
						}}
						source={image}
						onLoadEnd={onImageLoaded}
						fadeDuration={0}
					/>
				</Animated.View>
			)}
		</View>
	);
}
