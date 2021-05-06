import * as Sharing from 'expo-sharing';
import React from 'react';
import { Dimensions, Image, Platform, StyleSheet, Text, View } from 'react-native';
import TextButton from './components/TextButton';
import { Ionicons } from '@expo/vector-icons';

const { height, width } = Dimensions.get('window');
let imageWidth, imageHeight;
let orientation = height > width ? 'Portrait' : 'Landscape';

const isIpad = Platform.isPad; // Auxiliar constant because expo-sharing is not working on iPads

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
				<View style={styles.locationContainer}>
					<Ionicons name='location' size={38} color='#449c69' />
					<Text style={styles.text}>{location || 'Unknown location'}</Text>
				</View>
				<TextButton label='Share' onPress={__handleShare} />
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
	locationContainer: {
		flexDirection: 'row',
		width: '35%',
		minWidth: 250,
		alignItems: 'center',
		justifyContent: 'space-around',
	},
	text: {
		fontSize: 20,
		textAlign: 'center',
	},
});
