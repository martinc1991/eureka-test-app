import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, DevSettings, TouchableOpacity, View, Dimensions, Image, ScrollView } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { uriToID } from './auxiliar';

const { height, width } = Dimensions.get('window');

export default function ImageScreen({ route }) {
	const { uri, location } = route.params;
	return (
		<View>
			<Image source={{ uri: uri }} style={{ width: 300, height: 300 }} />
			{/* <Text>{uri}</Text> */}
			<Text>{location}</Text>
		</View>
	);
}
