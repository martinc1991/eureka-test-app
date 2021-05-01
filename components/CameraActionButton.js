import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function CameraActionButton({ label = 'icon', backgroundColor = 'transparent', onPress, size = 30 }) {
	const styles = StyleSheet.create({
		buttonContainer: {
			height: 40,
			width: 40,
			borderRadius: 50,
			backgroundColor: backgroundColor,
			alignContent: 'center',
			justifyContent: 'center',
		},
		buttonText: {
			fontSize: size,
			textAlign: 'center',
		},
	});

	return (
		<TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
			<Text style={styles.buttonText}>{label || 'x'}</Text>
		</TouchableOpacity>
	);
}
