import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function TextButton({ label, color = '#449c69', textColor = '#fff', onPress }) {
	const styles = StyleSheet.create({
		buttonContainer: {
			height: 40,
			backgroundColor: color,
			borderRadius: 10,
			justifyContent: 'center',
			alignItems: 'center',
			width: 250,
			maxWidth: '45%',
			shadowColor: '#000',
			shadowOffset: {
				width: 0,
				height: 4,
			},
			shadowOpacity: 0.3,
			shadowRadius: 4.65,
			elevation: 8,
		},
		buttonText: {
			color: textColor,
			fontWeight: 'bold',
			textAlign: 'center',
		},
	});

	return (
		<TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
			<Text style={styles.buttonText}>{label}</Text>
		</TouchableOpacity>
	);
}
