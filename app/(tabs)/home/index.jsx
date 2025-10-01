import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CustomAlertManager } from '../../../components/CustomAlert';
import CustomButton from '../../../components/CustomButton';
import FilterScreen from '../../../components/FilterScreen';
import { Colors, Fonts } from '../../../constants/theme';

export default function HomeScreen() {
    const router = useRouter();
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Geyim mağazaları');
    const [filterVisible, setFilterVisible] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState(null);

    const categories = [
        { id: 'clothing', name: 'Geyim', icon: 'shirt-outline', active: true },
        { id: 'books', name: 'Kitab', icon: 'book-outline', active: false },
        { id: 'markets', name: 'Market', icon: 'basket-outline', active: false },
        { id: 'beauty', name: 'Gözəllik', icon: 'sparkles-outline', active: false },
        { id: 'entertainment', name: 'Əyləncə', icon: 'game-controller-outline', active: false },
    ];

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    const checkAuthStatus = useCallback(async () => {
        try {
            const loggedIn = await AsyncStorage.getItem('loggedIn');
            if (loggedIn !== 'true') {
                router.replace('/(auth)/login');
                return;
            }

        } catch (error) {
            console.log('Auth check error:', error);
            router.replace('/(auth)/login');
        }
    }, [router]);

    const handleLogout = async () => {
        CustomAlertManager.show({
            title: 'Çıxış',
            message: 'Hesabınızdan çıxmaq istədiyinizə əminsiniz?',
            type: 'warning',
            buttons: [
                { text: 'Ləğv et', style: 'cancel' },
                {
                    text: 'Çıx',
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem('loggedIn');
                            await AsyncStorage.removeItem('user');
                            router.replace('/(auth)/login');
                        } catch (error) {
                            console.log('Logout error:', error);
                        }
                    }
                }
            ]
        });
    };

    const handleCategoryPress = (category) => {
        setSelectedCategory(category.name);
    };

    const handleFilterPress = () => {
        setFilterVisible(true);
    };

    const handleApplyFilters = (filters) => {
        setAppliedFilters(filters);
    };

    return (

        <ScrollView
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContent}
        >
            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={20} color={Colors.textSecondary} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Burada axtar"
                            placeholderTextColor={Colors.textSecondary}
                            value={searchText}
                            onChangeText={setSearchText}
                        />
                    </View>
                    <TouchableOpacity style={styles.filterButton} onPress={handleFilterPress}>
                        <Ionicons name="filter" size={20} color={Colors.textSecondary} />
                    </TouchableOpacity>
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                >
                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category.id}
                            style={[
                                styles.categoryButton,
                                selectedCategory === category.name && styles.categoryButtonActive
                            ]}
                            onPress={() => handleCategoryPress(category)}
                        >
                            <Ionicons
                                name={category.icon}
                                size={15}
                                color={selectedCategory === category.name ? '#fff' : Colors.textSecondary}
                            />
                            <Text style={[
                                styles.categoryText,
                                selectedCategory === category.name && styles.categoryTextActive
                            ]}>
                                {category.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <View style={styles.kartoCardSection}>
                    <View style={styles.kartoCard}>
                        <View style={styles.kartoHeader}>
                            <Image
                                source={require('../../../assets/images/kartoKart.png')}
                                style={styles.kartoHeaderText}
                                resizeMode="contain"
                            />
                        </View>

                        <View style={styles.kartoArtwork}>
                            <Image
                                source={require('../../../assets/images/karto.png')}
                                style={styles.kartoImage}
                                resizeMode="contain"
                            />
                        </View>

                        <Text style={styles.kartoSubtitle}>KartoKart - bir kart, sonsuz fürsət!</Text>

                        <Text style={styles.kartoDescription}>
                            Artıq hədiyyə seçməkdə tərəddüdə ehtiyac yoxdur. Kartokart ile sevdiklerin ne istədiyini özləri seçir. Onlarla ferqli onlayn mağaza, xidmet ve brend – bir kartın içində. İster texnologiya, ister geyim, istərsə de əyləncə – seçim tamamilə onlara aiddir. Bu sadece bir kart deyil, məhdudiyyətsiz imkanlar ve şəxsi seçim azadlığıdır. Hədiyyənin necə olacağını sen yox, alan özü müəyyən edir.
                        </Text>

                        <CustomButton title='"Karto" al' onPress={() => { }} />
                    </View>
                </View>
            </View>
            
            <FilterScreen
                visible={filterVisible}
                onClose={() => setFilterVisible(false)}
                onApplyFilters={handleApplyFilters}
            />
        </ScrollView>

    );
}

const styles = StyleSheet.create({
    categoriesContent: {
        paddingBottom: 80,
    },
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        // paddingBottom: 100,
        padding: 15,
        paddingTop: Platform.OS === 'android' ? 40 : 10,
    },
    searchContainer: {
        flexDirection: 'row',
        // paddingHorizontal: 20,
        marginBottom: 10,
        gap: 12,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 48,
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        fontFamily: Fonts.Poppins_Regular,
        color: Colors.textPrimary,
    },
    filterButton: {
        width: 48,
        height: 48,
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#aaa',
        gap: 5,
        marginRight: 5,
    },
    categoryButtonActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    categoryText: {
        fontSize: 14,
        fontFamily: Fonts.Poppins_Regular,
        color: Colors.textSecondary,
    },
    categoryTextActive: {
        color: '#fff',
    },
    kartoCardSection: {
        marginTop: 10,
    },
    kartoCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
        paddingTop:0,
    },
    kartoHeader: {
        alignItems: 'center',
        // marginBottom: 10,
    },
    kartoHeaderText: {
        width: 230,
        height: 50,
    },
    kartoArtwork: {
        alignItems: 'center',
        marginBottom: 10,
    },
    kartoImage: {
        width: "100%",
        height: 230,
    },
    kartoSubtitle: {
        fontSize: 14,
        fontFamily: Fonts.Poppins_SemiBold,
        color: Colors.textPrimary,
        textAlign: 'flex-start',
        marginBottom: 5,
    },
    kartoDescription: {
        fontSize: 12,
        fontFamily: Fonts.Poppins_Regular,
        color: Colors.textSecondary,
        lineHeight: 20,
        textAlign: 'flex-start',
        marginBottom: 20,
    },
    kartoButton: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    kartoButtonText: {
        fontSize: 16,
        fontFamily: Fonts.Poppins_SemiBold,
        color: '#fff',
    },
    
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.error,
        marginHorizontal: 20,
        marginBottom: 20,
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },
    logoutText: {
        fontSize: 16,
        fontFamily: Fonts.Poppins_SemiBold,
        color: '#fff',
    },
    
});
