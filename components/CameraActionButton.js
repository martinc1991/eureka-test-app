import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function CameraActionButton({ backgroundColor = 'transparent', onPress, size = 30, children }) {
	const styles = StyleSheet.create({
		buttonContainer: {
			height: 40,
			width: 40,
			borderRadius: 50,
			backgroundColor: backgroundColor,
			alignContent: 'center',
			justifyContent: 'center',
		},
	});

	return (
		<TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
			{children}
		</TouchableOpacity>
	);
}
