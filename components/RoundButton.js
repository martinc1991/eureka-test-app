import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function RoundButton({ color = '#449c69', textColor = '#fff', onPress, size = 50, children }) {
	const styles = StyleSheet.create({
		buttonContainer: {
			width: size,
			height: size,
			bottom: 0,
			borderRadius: 50,
			backgroundColor: color,
			justifyContent: 'center',
			alignItems: 'center',
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 7 },
			shadowOpacity: 0.41,
			shadowRadius: 9.11,
			elevation: 14,
		},
		buttonText: {
			color: textColor,
			fontWeight: 'bold',
			textAlign: 'center',
			fontSize: 30,
			marginBottom: 4,
		},
	});

	return (
		<TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
			{children}
		</TouchableOpacity>
	);
}
