import { Ionicons } from '@expo/vector-icons';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Fonts } from '../../../constants/theme';

export default function CommunityScreen() {

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Cəmiyyət</Text>
        <Text style={styles.subHeader}>KARTO istifadəçiləri ilə əlaqə saxlayın və yeniliklərdən xəbərdar olun!</Text> 
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
});
