import React from 'react'
import { View, ImageBackground, Text } from 'react-native'

import GiveClassesBgImg from '../../../assets/images/give-classes-background.png'

import styles from './style'
import { RectButton } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
 
export default function GiveClasses(){
    const {goBack} = useNavigation();

    function handleNavigateBack(){
        goBack();
    }

    return (
        <View style={styles.container}>
            <ImageBackground  style={styles.content} source={GiveClassesBgImg}>
                <Text style={styles.title} >
                    Quer ser um professor?
                </Text>
                <Text style={styles.description}>
                    Para começar, você precisa se cadastrar pela nossa página web.
                </Text>
            </ImageBackground>

            <RectButton onPress={handleNavigateBack} style={styles.okButton}>
                <Text style={styles.okButtonText}>Tudo Bem</Text>
            </RectButton>

        </View>
    )
}

//export default GiveClasses;