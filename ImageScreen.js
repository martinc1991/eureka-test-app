import React, { useState, useEffect } from 'react';
import * as Sharing from 'expo-sharing';
import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, TouchableOpacity, View, Dimensions, Image, ScrollView } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { uriToID } from './auxiliar';
var boca = require('./assets/boca.jpg');

const { height, width } = Dimensions.get('window');
let orientation = height > width ? 'Portrait' : 'Landscape';

export default function ImageScreen({ route }) {
	// const { uri, location } = route.params;

	const __handleShare = async (url) => {
		try {
			console.log('about to share');
			console.log('url to share: ', url);
			// let sharePromise = await Sharing.shareAsync(uri); // * uncomment this
			console.log(sharePromise);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.imageContainer}>
				<Image source={boca} style={styles.image} />
			</View>
			<View style={styles.textContainer}>
				{/* <Text>{uri}</Text> */}
				<Text style={styles.text}>Cordoba, Argentina</Text>
				<TouchableOpacity style={styles.buttonContainer} onPress={__handleShare}>
					<Text style={styles.buttonText}>Share</Text>
				</TouchableOpacity>
				{/* <Text>{location}</Text> */}
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
		// backgroundColor: 'red',
	},
	imageContainer: {
		// backgroundColor: 'gold',
		flex: 6,
		width,
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	image: {
		// minHeight: 100,
		// minWidth: 100,
		// height: 300,
		// width: 300,
		flex: 1,
		resizeMode: 'center',
	},
	textContainer: {
		// backgroundColor: 'blue',
		width,
		flex: 2,
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	text: {
		fontSize: 28,
		// backgroundColor: 'gold',
		textAlign: 'center',
	},
	buttonContainer: {
		backgroundColor: 'mediumseagreen',
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
		width: 0.7 * width,
		maxWidth: 500,
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
		lineHeight: 48,
		fontSize: 24,
		textAlign: 'center',
	},
});
