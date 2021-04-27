import { Camera } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, DevSettings, TouchableOpacity, View, Dimensions, Image, ScrollView, Platform } from 'react-native';
import CameraPreview from './components/CameraPreview';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import AppLoading from 'expo-app-loading';
// import { Asset } from 'expo-asset';
// import Constants from 'expo-constants';
// import * as SplashScreen from 'expo-splash-screen';
import { uriToID } from './auxiliar';

const platform = Platform.OS; // todo: handle saving process differences for both platforms

const { height, width } = Dimensions.get('window');
let orientation = height > width ? 'Portrait' : 'Landscape';
let appAlbum;
let camera;
// let idLocationMap = new Map();
let storageKeys;
export default function MainScreen({ navigation }) {
	console.log('\x1b[36m%s\x1b[0m', 'RENDER');
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
			try {
				// console.log('Locating device');
				let { status } = await Location.requestForegroundPermissionsAsync();
				// console.log(status);
				if (status !== 'granted') {
					setErrorMsg('Permission to access location was denied');
					return;
				}

				const MEDIA_LIBRARY_PERMISSION = await MediaLibrary.requestPermissionsAsync();
				setMediaLibraryPermission(MEDIA_LIBRARY_PERMISSION);

				appAlbum = await MediaLibrary.getAlbumAsync('eureka-test-app');
				if (!appAlbum) {
					console.log('\x1b[34m%s\x1b[0m', 'there is not an eureka album in this device yet');
				} else {
					// console.log('appAlbum: ', appAlbum);
					let testPicsArray = await MediaLibrary.getAssetsAsync({ first: 20, createdAfter: 1619306038, album: appAlbum.id || 'eureka-test-app' });
					console.log('*************');
					console.log('testPicsArray.assets: ', testPicsArray.assets);
					console.log('*************');
					// setPicturesFromStorage(picsArray.assets); // ! No need for this anymore?
					console.log('\x1b[34m%s\x1b[0m', 'You already have an eureka album, nicely done!');
					storageKeys = await AsyncStorage.getAllKeys();
					let picsArray = [];
					console.log('ABOUT TO ITERATE storageKeys');
					storageKeys.forEach(async (key, i) => {
						var value = await AsyncStorage.getItem(key);
						console.log(key + ': ', value);
						picsArray.push({ uri: key, location: value });
						// idLocationMap.set(key, value);
						// let assetInfo = await MediaLibrary.getAssetInfoAsync(pic);
					});
					// setPicturesFromStorage(picsArray);
				}

				// console.log('\x1b[35m%s\x1b[0m', 'inside FOR OF');
				// for (const i of idLocationMap) {
				// 	console.log(i[0] + ', ' + i[1]);
				// }

				// console.log(picturesFromStorage?.assets[0]);

				// Looks for the last known position of the device within 1000m and 30 minutes
				let lastKnownPosition = await Location.getLastKnownPositionAsync({ maxAge: 1 * 1000 * 60 * 30, requiredAccuracy: 1000 });
				// console.log('lastKnownPosition: ', lastKnownPosition);
				let lastKnownPosition_latitude = lastKnownPosition?.coords.latitude;
				let lastKnownPosition_longitude = lastKnownPosition?.coords.longitude;
				if (lastKnownPosition_latitude && lastKnownPosition_longitude) {
					lastKnownPosition = await Location.reverseGeocodeAsync({ latitude: lastKnownPosition_latitude, longitude: lastKnownPosition_longitude });
					// console.log('lastKnownPosition[0]: ', lastKnownPosition[0]);
					// console.log(lastKnownPosition[0]?.city + ', ' + lastKnownPosition[0]?.country + ' from memory');
					setLocation(lastKnownPosition[0]?.city + ', ' + lastKnownPosition[0]?.country);
				}
				// console.log('lastKnownPosition: ', lastKnownPosition);
				lastKnownPosition = await Location.getCurrentPositionAsync({});
				lastKnownPosition_latitude = lastKnownPosition.coords.latitude;
				lastKnownPosition_longitude = lastKnownPosition.coords.longitude;
				lastKnownPosition = await Location.reverseGeocodeAsync({ latitude: lastKnownPosition_latitude, longitude: lastKnownPosition_longitude });
				// console.log('lastKnownPosition: ', lastKnownPosition);
				// console.log(lastKnownPosition[0]?.city + ', ' + lastKnownPosition[0]?.country + ' updated!');
				setLocation(lastKnownPosition[0]?.city + ', ' + lastKnownPosition[0]?.country);
			} catch (error) {
				console.log(error);
			}
		})();
	}, []);

	const __startCamera = async () => {
		console.log('START CAMERA BUTTON PRESSED');
		const { status } = await Camera.requestPermissionsAsync();
		// console.log(status);
		if (status === 'granted') {
			setStartCamera(true);
		} else {
			Alert.alert('Access denied');
		}
	};

	const __closeCamera = () => {
		console.log('CLOSING CAMERA');
		setStartCamera(false);
	};

	const __takePicture = async () => {
		const photo = await camera.takePictureAsync();
		// console.log('taken picure info: ', photo);
		// photo.location = location;
		// console.log('updated picure info: ', photo);
		setPreviewVisible(true);
		//setStartCamera(false)
		setCapturedImage(photo);
	};

	const __savePhoto = async () => {
		try {
			console.log('----------------- INSIDE SAVE PHOTO -------------------');
			console.log('capturedImage.uri: ', capturedImage.uri);
			let asset = await MediaLibrary.createAssetAsync(capturedImage.uri);
			// console.log('*********************************************************************************************');
			// console.log('asset: ', asset);
			// console.log('*********************************************************************************************');

			if (!appAlbum) {
				// This method creates an album, but (on android) it adds an asset too
				appAlbum = await MediaLibrary.createAlbumAsync('eureka-test-app', asset, false);
				if (appAlbum) {
					console.log('eureka-test-app album created!');
				}
			} else {
				// Else, only add the asset to the library
				await MediaLibrary.addAssetsToAlbumAsync(asset, appAlbum.id || 'eureka-test-app', false);
				console.log('The was asset added to eureka-test-app album!');
			}
			// newAsset = await MediaLibrary.getAssetInfoAsync(asset.uri);
			// console.log('*********************************************************************************************');
			// console.log(newAsset);
			// console.log('*********************************************************************************************');
			let uri;
			if (platform === 'ios') {
				uri = asset.uri;
				console.log('uri saved: ', uri);
			} else {
				uri = capturedImage.uri;
				console.log('uri saved: ', uri);
			}

			console.log(uri);

			// Handle ID getting for different platforms
			// let picID;
			// if (platform === 'ios') {
			// 	// handle ios here
			// 	picID = asset.slice(0, asset.indexOf('/'));
			// } else {
			// 	// handle android here
			// 	picID = uriToID(capturedImage.uri);
			// }
			console.log('location: ', location);
			// let newStoragedAsset = await AsyncStorage.setItem(picID, 'test location');
			let newStoragedAsset = await AsyncStorage.setItem(uri, location ? location : 'locating error');
			console.log('newStoragedAsset: ', newStoragedAsset);
			console.log('picture succesfully saved');

			// Add new picture to picturesFromStorage array
			if (picturesFromStorage) {
				console.log('picturesFromStorage.length: ', picturesFromStorage.length);
				var newArray = picturesFromStorage.concat([{ uri: asset.requiredAccuracy, location: location }]);
				console.log('picturesFromStorage.length: ', newArray.length);
				setPicturesFromStorage(newArray);
				console.log('another picture added to the array succesfully');
			} else {
				setPicturesFromStorage([{ uri, location }]);
				console.log('first picture added to the array succesfully');
			}
			// console.log('picturesFromStorage: ', picturesFromStorage);
			console.log('------------------------------------');
			setCapturedImage(null);
		} catch (error) {
			console.log('\x1b[31m%s\x1b[0m', 'Problem saving image, failed');
			console.log(error);
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
			// console.log(flashMode);
		} else if (flashMode === 'off') {
			setFlashMode('on');
			// console.log(flashMode);
		} else {
			setFlashMode('auto');
			// console.log(flashMode);
		}
	};

	const __switchCamera = () => {
		if (cameraType === 'back') {
			setCameraType('front');
		} else {
			setCameraType('back');
		}
	};

	const __handleShare = async (url) => {
		try {
			console.log('about to share');
			console.log('url to share: ', url);
			let sharePromise = await Sharing.shareAsync(url);
			console.log(sharePromise);
		} catch (error) {
			console.log(error);
		}
	};

	// * Only to make testing easier
	const createTwoButtonAlert = () =>
		Alert.alert('Alert Title', 'Are you sure you want to erase all the pictures taken?', [
			{
				text: 'Cancel',
				onPress: () => console.log('Cancel Pressed'),
				style: 'cancel',
			},
			{ text: 'Yes, erase them', onPress: eraseStoragedPictures },
		]);
	const eraseStoragedPictures = async () => {
		try {
			console.log(storageKeys);
			if (storageKeys && storageKeys.length) {
				await AsyncStorage.multiRemove(storageKeys);
			}
			if (appAlbum) await MediaLibrary.deleteAlbumsAsync(appAlbum.id || 'eureka-test-app', true);
			console.log('succes erasing the storage');
			DevSettings.reload();
		} catch (error) {
			console.log(error);
			console.log('error erasing storage');
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
							<View style={{ flex: 1, width: '100%', backgroundColor: 'transparent', flexDirection: 'row' }}>
								<View style={{ position: 'absolute', left: '5%', top: '10%', flexDirection: 'column', justifyContent: 'space-between' }}>
									<TouchableOpacity onPress={__handleFlashMode} style={{ backgroundColor: flashMode === 'off' ? '#000' : '#fff', borderRadius: 50, height: 25, width: 25 }}>
										<Text style={{ fontSize: 20 }}>⚡️</Text>
									</TouchableOpacity>
									<TouchableOpacity onPress={__switchCamera} style={{ marginTop: 20, borderRadius: 50, height: 25, width: 25 }}>
										<Text style={{ fontSize: 20 }}>{cameraType === 'front' ? '🤳' : '📷'}</Text>
									</TouchableOpacity>
									<TouchableOpacity onPress={__closeCamera} style={{ marginTop: 20, borderRadius: 50, height: 25, width: 25 }}>
										<Text style={{ fontSize: 20 }}>❌</Text>
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
				<View>
					<ScrollView style={styles.picturesContainer} contentContainerStyle={styles.picturesContentContainer}>
						<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
							{picturesFromStorage ? (
								picturesFromStorage.map((pic, key) => {
									console.log('pic.uri: ', pic.uri);
									console.log('pic.location: ', pic.location);
									// console.log('uriToID(pic.uri): ', uriToID(pic.uri));
									// console.log('idLocationMap.get(uriToID(pic.uri)): ', idLocationMap.get(uriToID(pic.uri)));
									return (
										// todo: TERMINAR EL FLOW DE ALMACENADO EN ASYNCSTORAGE
										<TouchableOpacity
											onPress={() => navigation.navigate('ImageScreen', { uri: pic.uri, location: pic.location })}
											// onPress={() => {
											// 	__handleShare(pic.uri);
											// }}
											style={styles.imageGalleryContainer}
											key={key}>
											<Image
												source={{
													uri: pic.uri,
												}}
												style={{ width: (width - 24) / 3, maxWidth: (width - 24) / 3, height: (width - 24) / 3, maxHeight: (width - 24) / 3, marginBottom: 4, marginHorizontal: 2 }}
											/>
											<Text>{pic.location ? pic.location : 'no location in this picture'}</Text>
										</TouchableOpacity>
									);
								})
							) : (
								<View></View>
							)}
						</View>
					</ScrollView>
					<View style={styles.bottomContainer}>
						<TouchableOpacity onPress={__startCamera} style={styles.takePictureButton} disabled={!location}>
							<Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 30, marginBottom: 4 }}>+</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={createTwoButtonAlert} style={{ width: 130, borderRadius: 4, backgroundColor: 'red', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 40, marginVertical: 5 }}>
							<Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Erase storage</Text>
						</TouchableOpacity>
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
		// marginTop: 20,
		backgroundColor: 'white',
	},
	picturesContentContainer: {
		flexDirection: 'column',
		// flexWrap: 'wrap',
		// backgroundColor: 'grey',
	},
	imageGalleryContainer: {
		// backgroundColor: 'red',
		maxHeight: width,
	},
	bottomContainer: {
		position: 'absolute',
		width,
		top: 0.8 * (height - 50),
		backgroundColor: 'transparent',
		justifyContent: 'space-around',
		alignItems: 'center',
		flexDirection: 'row',
		height: 0.1 * height,
	},
	takePictureButton: {
		width: 50,
		height: 50,
		borderRadius: 30,
		backgroundColor: 'mediumseagreen',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginVertical: 5,
	},
});
