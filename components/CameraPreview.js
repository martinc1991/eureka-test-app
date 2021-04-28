import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

export default CameraPreview = ({ photo, retakePicture, savePhoto, closeCamera }) => {
	return (
		<View style={{ backgroundColor: 'transparent', flex: 1, width: '100%', height: '100%' }}>
			<ImageBackground source={{ uri: photo && photo.uri }} style={{ flex: 1 }}>
				<View style={{ flex: 1, flexDirection: 'column', padding: 15, justifyContent: 'flex-end' }}>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
						<TouchableOpacity onPress={retakePicture} style={{ height: 40, backgroundColor: '#449c69', borderRadius: 10, justifyContent: 'center', alignItems: 'center', width: 0.7 * width, maxWidth: '40%', shadowColor: '#000', shadowOffset: { width: 0, height: 1 } }}>
							<Text style={{ color: '#fff' }}>Try Again</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={savePhoto} style={{ height: 40, backgroundColor: '#449c69', borderRadius: 10, justifyContent: 'center', alignItems: 'center', width: 0.7 * width, maxWidth: '40%', shadowColor: '#000', shadowOffset: { width: 0, height: 1 } }}>
							<Text style={{ color: '#fff' }}>Save</Text>
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
