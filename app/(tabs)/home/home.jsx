import { StyleSheet, Text, View } from 'react-native';
import { Colors, Fonts } from '../../../constants/theme';

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Home Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: Fonts.MPlusRegular,
        color: Colors.text,
    },
});