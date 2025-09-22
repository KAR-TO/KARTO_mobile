import AntDesign from '@expo/vector-icons/AntDesign';
import { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors, Fonts } from '../constants/theme';

const CountryDropdown = ({ countries, selectedCountry, onSelect }) => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleDropdown = () => setIsVisible(!isVisible);

    const selectCountry = (country) => {
        onSelect(country);
        setIsVisible(false);
    };

    const renderCountryItem = (item, index) => (
        <TouchableOpacity
            key={item.code}
            style={[
                styles.countryItem,
                item.code === selectedCountry.code && styles.selectedCountryItem,
                index === countries.length - 1 && { borderBottomWidth: 0 },
            ]}
            onPress={() => selectCountry(item)}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.countryLabel}>{item.label}</Text>
                <Text style={[styles.phonePrefix, { marginLeft: 8 }]}>{item.code}</Text>
            </View>
            {item.code === selectedCountry.code && (
                <AntDesign name="check" size={16} color={Colors.primary} />
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={toggleDropdown} style={styles.countrySelector}>
                <Text style={styles.countryLabel}>{selectedCountry.label}</Text>
                <Text style={styles.phonePrefix}>{selectedCountry.code}</Text>
                <AntDesign 
                    name={isVisible ? "up" : "down"} 
                    size={12} 
                    color={Colors.primary} 
                />
            </TouchableOpacity>

            {isVisible && (
                <View style={styles.dropdownContainer}>
                    <ScrollView 
                        style={styles.countryList}
                        showsVerticalScrollIndicator={false}
                        nestedScrollEnabled={true}
                    >
                        {countries.map((item, index) => renderCountryItem(item, index))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        zIndex: 1000,
    },
    countrySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginRight: 8,
        borderRightWidth: 1,
        borderRightColor: Colors.border,
        gap: 4,
    },
    countryLabel: {
        color: Colors.primary,
        fontFamily: Fonts.Poppins_SemiBold,
        fontSize: 12,
    },
    phonePrefix: {
        fontFamily: Fonts.Poppins_Regular,
        color: Colors.textPrimary,
        marginRight: 6,
    },
    dropdownContainer: {
        position: 'absolute',
        top: 40,
        left: 0,
        right: -8,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.border,
        maxHeight: 200,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 1001,
    },
    countryList: {
        borderRadius: 8,
    },
    countryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.inputBackground,
    },
    selectedCountryItem: {
        backgroundColor: Colors.inputBackground,
    },
});

export default CountryDropdown;