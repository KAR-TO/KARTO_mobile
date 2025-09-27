import AntDesign from '@expo/vector-icons/AntDesign';
import { useRef, useState } from 'react';
import {
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors, Fonts } from '../constants/theme';

const CountryDropdown = ({ countries, selectedCountry, onSelect }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [dropdownLayout, setDropdownLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const selectorRef = useRef(null);

    const toggleDropdown = () => {
        if (!isVisible && selectorRef.current) {
            selectorRef.current.measure((x, y, width, height, pageX, pageY) => {
                setDropdownLayout({
                    x: pageX,
                    y: pageY,
                    width,
                    height
                });
                setIsVisible(true);
            });
        } else {
            setIsVisible(false);
        }
    };

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
        <>
            <View style={styles.container}>
                <TouchableOpacity
                    ref={selectorRef}
                    onPress={toggleDropdown}
                    style={styles.countrySelector}
                >
                    <Text style={styles.countryLabel}>{selectedCountry.label}</Text>
                    <Text style={styles.phonePrefix}>{selectedCountry.code}</Text>
                    <AntDesign
                        name={isVisible ? "up" : "down"}
                        size={12}
                        color={Colors.primary}
                    />
                </TouchableOpacity>
            </View>

            <Modal
                visible={isVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setIsVisible(false)}
                >
                    <View
                        style={[
                            styles.dropdownContainer,
                            {
                                top: dropdownLayout.y + 5,
                                left: dropdownLayout.x - 12,
                            }
                        ]}
                    >
                        <ScrollView
                            style={styles.countryList}
                            showsVerticalScrollIndicator={false}
                            nestedScrollEnabled={true}
                        >
                            {countries.map((item, index) => renderCountryItem(item, index))}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    countrySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginRight: 6,
        borderRightWidth: 1,
        borderRightColor: Colors.border,
        gap: 3,
    },
    countryLabel: {
        color: Colors.primary,
        fontFamily: Fonts.Poppins_SemiBold,
        fontSize: 11,
    },
    phonePrefix: {
        fontFamily: Fonts.Poppins_Regular,
        color: Colors.textPrimary,
        fontSize: 11,
        marginRight: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    dropdownContainer: {
        position: 'absolute',
        width: 120,
        paddingTop: 5,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.border,
        maxHeight: 150,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 10,
            },
        }),
    },
    countryList: {
        borderRadius: 8,
    },
    countryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.inputBackground,
    },
    selectedCountryItem: {
        backgroundColor: Colors.inputBackground,
    },
});

export default CountryDropdown;