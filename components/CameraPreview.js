import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import TextButton from './TextButton';

export default CameraPreview = ({ photo, retakePicture, savePhoto }) => {
	return (
		<View style={styles.container}>
			<ImageBackground source={{ uri: photo && photo.uri }} style={{ flex: 1 }}>
				<View style={styles.overScreenContainer}>
					<View style={styles.buttonsContainer}>
						<TextButton label='Try Again' onPress={retakePicture} />
						<TextButton label='Save' color='#fed106' onPress={savePhoto} />
					</View>
				</View>
			</ImageBackground>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'transparent',
		flex: 1,
		width: '100%',
		height: '100%',
	},
	overScreenContainer: {
		flex: 1,
		flexDirection: 'column',
		padding: 15,
		justifyContent: 'flex-end',
	},
	buttonsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
});
