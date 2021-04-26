import { Camera } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, Platform, TouchableOpacity, View, Dimensions, Image } from 'react-native';
import CameraPreview from './components/CameraPreview';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';

let { height, width } = Dimensions.get('window');
let orientation = height > width ? 'Portrait' : 'Landscape';

let camera;
export default function App() {
	console.log('\x1b[36m%s\x1b[0m', '--------------------------------------------------------------------------------------------');
	const [startCamera, setStartCamera] = useState(false);
	const [previewVisible, setPreviewVisible] = useState(false);
	const [capturedImage, setCapturedImage] = useState(null);
	const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
	const [flashMode, setFlashMode] = useState('off');
	const [location, setLocation] = useState(null);
	const [errorMsg, setErrorMsg] = useState(null);
	const [mediaLibraryPermission, setMediaLibraryPermission] = useState(null);
	const [picturesFromStorage, setPicturesFromStorage] = useState(null);

	useEffect(() => {
		(async () => {
			console.log('Locating device');
			let { status } = await Location.requestForegroundPermissionsAsync();
			// console.log(status);
			if (status !== 'granted') {
				setErrorMsg('Permission to access location was denied');
				return;
			}

			let MEDIA_LIBARY_PERMISSION = MediaLibrary.requestPermissionsAsync();
			setMediaLibraryPermission(MEDIA_LIBARY_PERMISSION);

			let picsArray = await MediaLibrary.getAssetsAsync({ first: 2, createdAfter: 1619393185 });
			setPicturesFromStorage(picsArray.assets);
			// console.log(picturesFromStorage?.assets[0]);

			let lastKnownPosition = await Location.getLastKnownPositionAsync({ maxAge: 1 * 1000 * 60 * 60, requiredAccuracy: 10000 });
			var lastKnownPosition_latitude = lastKnownPosition.coords.latitude;
			var lastKnownPosition_longitude = lastKnownPosition.coords.longitude;
			lastKnownPosition = await Location.reverseGeocodeAsync({ latitude: lastKnownPosition_latitude, longitude: lastKnownPosition_longitude });
			setLocation(lastKnownPosition[0]?.city + ', ' + lastKnownPosition[0]?.country + ' from memory');
			let location = await Location.getCurrentPositionAsync({});
			var latitude = location.coords.latitude;
			var longitude = location.coords.longitude;
			location = await Location.reverseGeocodeAsync({ latitude, longitude });
			// console.log('location');
			// console.log(location[0]?.city + ', ' + location[0]?.country);
			setLocation(location[0]?.city + ', ' + location[0]?.country + ' updated!');
		})();
	}, []);

	let text = 'Waiting..';
	if (errorMsg) {
		text = errorMsg;
	} else if (location) {
		text = location;
	}

	const __startCamera = async () => {
		console.log('START CAMERA BUTTON PRESSED');
		const { status } = await Camera.requestPermissionsAsync();
		console.log(status);
		if (status === 'granted') {
			setStartCamera(true);
		} else {
			Alert.alert('Access denied');
		}
	};

	const __takePicture = async () => {
		const photo = await camera.takePictureAsync();
		console.log(photo);
		setPreviewVisible(true);
		//setStartCamera(false)
		setCapturedImage(photo);
	};

	const __savePhoto = async () => {
		console.log('capturedImage: ', capturedImage);
		let asset = await MediaLibrary.createAssetAsync(capturedImage?.uri);
		console.log('photo saved');
		console.log(asset);
		setCapturedImage(null);
	};

	const __retakePicture = () => {
		setCapturedImage(null);
		setPreviewVisible(false);
		__startCamera();
	};

	const __handleFlashMode = () => {
		if (flashMode === 'on') {
			setFlashMode('off');
		} else if (flashMode === 'off') {
			setFlashMode('on');
		} else {
			setFlashMode('auto');
		}
	};

	const __switchCamera = () => {
		if (cameraType === 'back') {
			setCameraType('front');
		} else {
			setCameraType('back');
		}
	};

	return (
		<View style={styles.container}>
			{startCamera ? (
				<View style={{ flex: 1, width: '100%' }}>
					{previewVisible && capturedImage ? (
						<CameraPreview photo={capturedImage} savePhoto={__savePhoto} retakePicture={__retakePicture} />
					) : (
						<Camera
							type={cameraType}
							flashMode={flashMode}
							style={{ flex: 1 }}
							ref={(r) => {
								camera = r;
							}}>
							<View style={{ flex: 1, width: '100%', backgroundColor: 'transparent', flexDirection: 'row' }}>
								<View style={{ position: 'absolute', left: '5%', top: '10%', flexDirection: 'column', justifyContent: 'space-between' }}>
									<TouchableOpacity onPress={__handleFlashMode} style={{ backgroundColor: flashMode === 'off' ? '#000' : '#fff', borderRadius: 50, height: 25, width: 25 }}>
										<Text style={{ fontSize: 20 }}>⚡️</Text>
									</TouchableOpacity>
									<TouchableOpacity onPress={__switchCamera} style={{ marginTop: 20, borderRadius: 50, height: 25, width: 25 }}>
										<Text style={{ fontSize: 20 }}>{cameraType === 'front' ? '🤳' : '📷'}</Text>
									</TouchableOpacity>
								</View>
								<View style={{ position: 'absolute', bottom: 0, flexDirection: 'row', flex: 1, width: '100%', padding: 20, justifyContent: 'space-between' }}>
									<View style={{ alignSelf: 'center', flex: 1, alignItems: 'center' }}>
										<TouchableOpacity onPress={__takePicture} style={{ width: 70, height: 70, bottom: 0, borderRadius: 50, backgroundColor: '#fff' }} />
									</View>
								</View>
							</View>
						</Camera>
					)}
				</View>
			) : (
				<View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
					<TouchableOpacity onPress={__startCamera} style={{ width: 130, borderRadius: 4, backgroundColor: '#14274e', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 40 }}>
						<Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Take picture</Text>
					</TouchableOpacity>

					{picturesFromStorage ? (
						picturesFromStorage.map((pic, key) => {
							console.log(pic.uri);
							return (
								<View style={styles.container} key={key}>
									<Image
										source={{
											uri: pic.uri,
										}}
										style={{ width: pic.width / 6, height: pic.height / 6 }}
									/>
								</View>
							);
						})
					) : (
						<View style={styles.container}>
							<Text>{text}</Text>
						</View>
					)}
				</View>
			)}

			<StatusBar style='auto' />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
