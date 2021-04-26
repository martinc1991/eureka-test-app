import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default CameraPreview = ({ photo, retakePicture, savePhoto }) => {
	console.log('picture data', photo);
	// var pictureObjectSchema = {
	// 	height: 2448,
	// 	uri: 'file:///var/mobile/Containers/Data/Application/B4528345-CFE1-490B-A598-4B730562CE8D/Library/Caches/ExponentExperienceData/%2540martinc1991%252Feureka-test-app/Camera/D3C6BB08-A47F-459A-9922-6A4D07B385DF.jpg',
	// 	width: 1836,
	// };

	return (
		<View style={{ backgroundColor: 'transparent', flex: 1, width: '100%', height: '100%' }}>
			<ImageBackground source={{ uri: photo && photo.uri }} style={{ flex: 1 }}>
				<View style={{ flex: 1, flexDirection: 'column', padding: 15, justifyContent: 'flex-end' }}>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
						<TouchableOpacity onPress={retakePicture} style={{ width: 130, height: 40, alignItems: 'center', borderRadius: 4 }}>
							<Text style={{ color: '#fff', fontSize: 20 }}>Re-take</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={savePhoto} style={{ width: 130, height: 40, alignItems: 'center', borderRadius: 4 }}>
							<Text style={{ color: '#fff', fontSize: 20 }}>save photo</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ImageBackground>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
