import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, StatusBar, Dimensions } from 'react-native';
import CustomButton from '../../../components/CustomButton';
import { Colors, Fonts } from '../../../constants/theme';


const { height } = Dimensions.get('window');

export default function HomeScreen() {
    const router = useRouter();
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Geyim mağazaları');


    const categories = [
        { id: 'all', name: 'Hamısı', icon: 'grid-outline' },
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

    const handleCategoryPress = (category) => {
        router.push({
            pathname: '/(tabs)/wallets',
            params: { category: category.id }
        });
        setSelectedCategory(category.name);
    };

    const handleFilterPress = () => {
        router.push({ pathname: '/(tabs)/wallets', params: { openFilter: '1' } });
    };



    return (
        <ScrollView
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.categoriesContent, {
                paddingTop:
                    Platform.OS === 'android'
                        ? height * 0.04 
                        : height * 0.02,
            }]}
        >
            <StatusBar
                translucent={Platform.OS === 'android'}
                backgroundColor={Platform.OS === 'android' ? 'transparent' : undefined}
                barStyle='dark-content'
            />
            <View style={styles.container}>
                <View style={[styles.searchContainer, styles.horizontalPadding]}>
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={20} color={Colors.textSecondary} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Burada axtar"
                            placeholderTextColor={Colors.textSecondary}
                            value={searchText}
                            onChangeText={setSearchText}
                            onSubmitEditing={() => {
                                router.push({
                                    pathname: '/(tabs)/wallets',
                                    params: { q: searchText || '', focusSearch: '1' }
                                });
                            }}
                        />
                    </View>
                    <TouchableOpacity style={styles.filterButton} onPress={handleFilterPress}>
                        <Ionicons name="filter" size={20} color={Colors.textSecondary} />
                    </TouchableOpacity>
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoriesContainer}
                    contentContainerStyle={styles.categoriesContentContainer}
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

                <View style={[styles.kartoCardSection, styles.horizontalPadding]}>
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


        </ScrollView>

    );
}

const styles = StyleSheet.create({
    horizontalPadding: {
        paddingHorizontal: 12,
    },
    categoriesContent: {
        paddingBottom: 80,
        backgroundColor: '#f8f9fa',
    },
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        // padding: 15,
    },
    searchContainer: {
        flexDirection: 'row',
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
    categoriesContainer: {
        paddingBottom: 5,
    },
    categoriesContentContainer: {
        paddingHorizontal: 12,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 25,
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.08)',
        gap: 5,
        marginRight: 7,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 5,
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
        marginTop: 5,
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
        paddingTop: 0,
    },
    kartoHeader: {
        alignItems: 'center',
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
