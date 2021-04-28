import * as Sharing from 'expo-sharing';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';

const { height, width } = Dimensions.get('window');
let imageWidth, imageHeight;
let orientation = height > width ? 'Portrait' : 'Landscape';

const isIpad = Platform.isPad; // Auxiliar constant because sexpo-sharing is not working on iPads

export default function ImageScreen({ route }) {
	const { uri, location } = route.params;

	Image.getSize(uri, () => {
		imageWidth = width;
		imageHeight = height;
		orientation = imageHeight > imageWidth ? 'Portrait' : 'Landscape';
	});

	const __handleShare = async () => {
		if (isIpad) return; // Sharing is not working on iPad (https://github.com/expo/expo/labels/Sharing)
		try {
			await Sharing.shareAsync(uri);
		} catch (error) {
			console.log(error);
			console.log('\x1b[31m%s\x1b[0m', 'Problem inside __handleShare');
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.imageContainer}>
				<Image source={uri ? { uri: uri } : require('./assets/placeholder.png')} style={styles.image} />
			</View>
			<View style={styles.textContainer}>
				<Text style={styles.text}>{location || 'Unknown location'}</Text>
				<TouchableOpacity style={styles.buttonContainer} onPress={__handleShare}>
					<Text style={styles.buttonText}>Share</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	imageContainer: {
		flex: 6,
		overflow: 'hidden',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	image: {
		minWidth: width,
		height: 200,
		width: 200,
		flex: 1,
		resizeMode: 'cover',
	},
	textContainer: {
		width,
		flex: 3,
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	text: {
		fontSize: 24,
		textAlign: 'center',
	},
	buttonContainer: {
		height: 40,
		backgroundColor: '#449c69',
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
		width: 0.7 * width,
		maxWidth: 300,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.2,
		shadowRadius: 1.41,
		elevation: 2,
	},
	buttonText: {
		color: '#fff',
		fontWeight: 'bold',
		textAlign: 'center',
	},
});
