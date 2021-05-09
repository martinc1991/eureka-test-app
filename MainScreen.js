import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, DevSettings, Dimensions, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CameraPreview from './components/CameraPreview';
import RoundButton from './components/RoundButton';
import TextButton from './components/TextButton'; // Dont remove
import CameraActionButton from './components/CameraActionButton';
import { Ionicons } from '@expo/vector-icons';

const platform = Platform.OS;

const { height, width } = Dimensions.get('window');
let appAlbum;
let camera;

let storageKeys;
export default function MainScreen({ navigation }) {
	const [startCamera, setStartCamera] = useState(false);
	const [previewVisible, setPreviewVisible] = useState(false);
	const [capturedImage, setCapturedImage] = useState(null);
	const [cameraType, setCameraType] = useState('back');
	const [flashMode, setFlashMode] = useState('off');
	const [location, setLocation] = useState('');
	const [mediaLibraryPermission, setMediaLibraryPermission] = useState(null);
	const [picturesFromStorage, setPicturesFromStorage] = useState([]);

	useEffect(() => {
		(async () => {
			try {
				const MEDIA_LIBRARY_PERMISSION = await MediaLibrary.requestPermissionsAsync();
				setMediaLibraryPermission(MEDIA_LIBRARY_PERMISSION);
				__getPictures();

				let { status } = await Location.requestForegroundPermissionsAsync();

				if (status !== 'granted') {
					return;
				} else {
					__getLocation();
				}
			} catch (error) {
				console.log(error);
				console.log('\x1b[31m%s\x1b[0m', 'Problem inside useEffect');
			}
		})();
	}, []);

	const __getLocation = async () => {
		try {
			// Looks for the last known position (LKP) of the device within 1000m and 30 minutes
			let LKP = await Location.getLastKnownPositionAsync({ maxAge: 1 * 1000 * 60 * 30, requiredAccuracy: 1000 });
			let LKP_latitude = LKP?.coords.latitude;
			let LKP_longitude = LKP?.coords.longitude;

			if (LKP_latitude && LKP_longitude) {
				LKP = await Location.reverseGeocodeAsync({ latitude: LKP_latitude, longitude: LKP_longitude });
				setLocation(LKP[0]?.city + ', ' + LKP[0]?.country);
			} else {
				LKP = await Location.getCurrentPositionAsync({});
				LKP_latitude = LKP.coords.latitude;
				LKP_longitude = LKP.coords.longitude;
				LKP = await Location.reverseGeocodeAsync({ latitude: LKP_latitude, longitude: LKP_longitude });
				setLocation(LKP[0]?.city + ', ' + LKP[0]?.country);
			}
			return;
		} catch (error) {
			console.log(error);
			console.log('\x1b[31m%s\x1b[0m', 'Problem getting the location, failed');
			return;
		}
	};

	const __getPictures = async () => {
		try {
			appAlbum = await MediaLibrary.getAlbumAsync('eureka-test-app');
			if (!appAlbum) {
				console.log('\x1b[34m%s\x1b[0m', 'There is not an eureka album in this device yet');
			} else {
				await MediaLibrary.getAssetsAsync({ first: 20, createdAfter: 1619306038, album: appAlbum.id || 'eureka-test-app' });
				console.log('\x1b[34m%s\x1b[0m', 'You already have an eureka album, nicely done!');
				storageKeys = await AsyncStorage.getAllKeys();
				let picsArray = await AsyncStorage.multiGet(storageKeys);

				setPicturesFromStorage(picsArray);
			}
			return;
		} catch (error) {
			console.log(error);
			console.log('\x1b[31m%s\x1b[0m', 'Problem getting images, failed');
			return;
		}
	};

	const __startCamera = async () => {
		const { status } = await Camera.requestPermissionsAsync();
		if (status === 'granted') {
			setStartCamera(true);
		} else {
			Alert.alert('Access denied');
		}
	};

	const __closeCamera = () => {
		setStartCamera(false);
	};

	const __takePicture = async () => {
		const photo = await camera.takePictureAsync();
		setPreviewVisible(true);
		setCapturedImage(photo);
	};

	const __savePhoto = async () => {
		try {
			let asset = await MediaLibrary.createAssetAsync(capturedImage.uri);
			if (!appAlbum) {
				// This method creates an album, but (on android) it adds an asset too
				appAlbum = await MediaLibrary.createAlbumAsync('eureka-test-app', asset, false);
				if (appAlbum) {
					console.log('eureka-test-app album created!');
				}

				if (platform === 'ios') {
					// Handle adding the asset on ios
					await MediaLibrary.addAssetsToAlbumAsync(asset, appAlbum.id || 'eureka-test-app', false);
					console.log('The asset was added to eureka-test-app album! (only ios)');
				}
			} else {
				// Else, only add the asset to the library
				await MediaLibrary.addAssetsToAlbumAsync(asset, appAlbum.id || 'eureka-test-app', false);
				console.log('The asset was added to eureka-test-app album!');
			}

			let uri;
			if (platform === 'ios') {
				uri = asset.uri;
			} else {
				uri = capturedImage.uri;
			}

			await AsyncStorage.setItem(uri, location ? location : 'Unkown location.');
			console.log('Picture succesfully saved to AsyncStorage');

			// Add new picture to picturesFromStorage array
			if (picturesFromStorage && picturesFromStorage.length > 0) {
				// There is already pictures in the array
				picturesFromStorage.push([uri, location]);
				setPicturesFromStorage(picturesFromStorage);
				console.log('Another picture more added to the array succesfully');
			} else {
				// There is no pictures in the array
				setPicturesFromStorage([[uri, location]]);
				console.log('First picture added to the array succesfully');
			}
			setCapturedImage(null);
		} catch (error) {
			console.log(error);
			console.log('\x1b[31m%s\x1b[0m', 'Problem saving image, failed');
			setCapturedImage(null);
		}
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

	// * Only to make testing easier (comment for production)
	const createTwoButtonAlert = () =>
		Alert.alert("You're about to delete all pictures", 'Are you sure you want to erase all the pictures taken?', [
			{
				text: 'Cancel',
				onPress: () => console.log('Cancel Pressed'),
				style: 'cancel',
			},
			{ text: 'Yes, erase them', onPress: eraseStoragedPictures },
		]);
	const eraseStoragedPictures = async () => {
		try {
			if (storageKeys && storageKeys.length) {
				await AsyncStorage.multiRemove(storageKeys);
			}
			if (appAlbum) await MediaLibrary.deleteAlbumsAsync(appAlbum.id || 'eureka-test-app', true);
			DevSettings.reload();
		} catch (error) {
			console.log(error);
			console.log('\x1b[31m%s\x1b[0m', 'Error erasing storage, failed');
		}
	};
	// * Only to make testing easier

	return (
		<View style={styles.container}>
			{startCamera ? (
				<View style={{ flex: 1, width: '100%' }}>
					{previewVisible && capturedImage ? (
						<CameraPreview photo={capturedImage} savePhoto={__savePhoto} retakePicture={__retakePicture} closeCamera={__closeCamera} />
					) : (
						<Camera
							type={cameraType}
							flashMode={flashMode}
							style={{ flex: 1 }}
							ref={(r) => {
								camera = r;
							}}>
							<View style={styles.cameraView}>
								<View style={styles.cameraTopContainer}>
									{/* Camera actions */}
									<View style={styles.cameraButtonsContainer}>
										<CameraActionButton onPress={__closeCamera}>
											<Ionicons style={{ textAlign: 'center' }} name='close' size={28} color='firebrick' />
										</CameraActionButton>
									</View>
									<View style={styles.cameraButtonsContainer}>
										<CameraActionButton backgroundColor={flashMode === 'off' ? '#000' : '#fff'} size={20} onPress={__handleFlashMode}>
											<Ionicons style={{ textAlign: 'center' }} name={flashMode === 'off' ? 'flash-off' : 'flash'} size={24} color='#fed106' />
										</CameraActionButton>
										<CameraActionButton onPress={__switchCamera}>
											<Ionicons style={{ textAlign: 'center' }} name={cameraType === 'front' ? 'camera-reverse' : 'camera-reverse'} size={28} color='#449c69' />
										</CameraActionButton>
									</View>
								</View>
								<View style={styles.takePictureContainer}>
									<View style={{ alignSelf: 'center', flex: 1, alignItems: 'center' }}>
										<RoundButton onPress={__takePicture} size={60} color='#449c69'>
											<Ionicons style={{ textAlign: 'center' }} name='camera' size={28} color='white' />
										</RoundButton>
									</View>
								</View>
							</View>
						</Camera>
					)}
				</View>
			) : (
				<View>
					<ScrollView style={styles.picturesContainer} contentContainerStyle={styles.picturesContentContainer}>
						<View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingTop: 6, paddingBottom: 100 }}>
							{picturesFromStorage ? (
								picturesFromStorage.map((pictureElement, key) => {
									return (
										<TouchableOpacity onPress={() => navigation.navigate('ImageScreen', { uri: pictureElement[0] ? pictureElement[0] : '', location: pictureElement[1] })} style={styles.imageGalleryContainer} key={key}>
											<Image source={{ uri: pictureElement[0] ? pictureElement[0] : '' }} style={styles.pictures} />
										</TouchableOpacity>
									);
								})
							) : (
								<View></View>
							)}
						</View>
					</ScrollView>
					<View style={styles.bottomContainer}>
						<RoundButton onPress={__startCamera}>
							<Ionicons style={{ textAlign: 'center' }} name='add' size={32} color='white' />
						</RoundButton>
						{/* Only to make testing easier (comment TouchableOpacity below for production) */}
						{/* <TextButton label='Erase storage' onPress={createTwoButtonAlert} color='firebrick' /> */}
					</View>
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
	picturesContainer: {
		flex: 1,
		flexDirection: 'column',
		width,
		paddingHorizontal: 4,
		backgroundColor: 'white',
	},
	picturesContentContainer: {
		flexDirection: 'column',
	},
	imageGalleryContainer: {
		maxHeight: width,
	},
	pictures: {
		width: (width - 24) / 3,
		maxWidth: (width - 24) / 3,
		height: (width - 24) / 3,
		maxHeight: (width - 24) / 3,
		marginBottom: 4,
		marginHorizontal: 2,
		borderRadius: width * 0.01,
	},
	bottomContainer: {
		position: 'absolute',
		width,
		top: '87%',
		backgroundColor: 'transparent',
		justifyContent: 'space-around',
		alignItems: 'center',
		flexDirection: 'row',
		height: 0.1 * height,
	},
	cameraView: {
		flex: 1,
		width: '100%',
		backgroundColor: 'transparent',
		flexDirection: 'row',
	},
	cameraTopContainer: {
		position: 'absolute',
		padding: '2%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		width: '100%',
	},
	cameraButtonsContainer: {
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 100,
	},
	takePictureContainer: {
		position: 'absolute',
		bottom: 0,
		flexDirection: 'row',
		flex: 1,
		width: '100%',
		padding: 20,
		justifyContent: 'space-between',
	},
});
