import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors, Fonts } from '../../../constants/theme';
import CustomButton from '../../../components/CustomButton';

export default function HomeScreen() {
    const router = useRouter();
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Geyim mağazaları');

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
        Alert.alert(
            'Çıxış',
            'Hesabınızdan çıxmaq istədiyinizə əminsiniz?',
            [
                { text: 'Ləğv et', style: 'cancel' },
                {
                    text: 'Çıx',
                    style: 'destructive',
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
        );
    };

    const handleCategoryPress = (category) => {
        setSelectedCategory(category.name);
    };

    // const handleOfferPress = (offer) => {
    //     router.push({
    //         pathname: '/gift-purchase/selection',
    //         params: {
    //             brand: offer.brand,
    //             category: offer.category,
    //             price: offer.price
    //         }
    //     });
    // };

    return (

        <ScrollView
            // horizontal
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
                    <TouchableOpacity style={styles.filterButton}>
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
                {/* 
                <View style={styles.offersSection}>
                    <View style={styles.offersHeader}>
                        <Ionicons name="star" size={20} color={Colors.warning} />
                        <Text style={styles.offersTitle}>Ən sərfəli təkliflər</Text>
                    </View>
                    <Text style={styles.offersSubtitle}>Karto istifadəçilərinin 99%-i bu kartları seçir</Text>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.offersContainer}
                    >
                        {bestOffers.map((offer) => (
                            <TouchableOpacity
                                key={offer.id}
                                style={[styles.offerCard, { backgroundColor: offer.color }]}
                                onPress={() => handleOfferPress(offer)}
                            >
                                <View style={styles.offerCardHeader}>
                                    {offer.image ? (
                                        <Image
                                            source={offer.image}
                                            style={styles.offerImage}
                                            resizeMode="contain"
                                        />
                                    ) : (
                                        <Text style={styles.offerLogo}>{offer.logo}</Text>
                                    )}
                                    <Ionicons name="flame" size={16} color={Colors.warning} />
                                </View>

                                <View style={styles.offerCardContent}>
                                    <Text style={[styles.offerBrand, { color: offer.accentColor }]}>
                                        {offer.brand}
                                    </Text>
                                    <Text style={styles.offerPrice}>{offer.price}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.additionalFeatures}>
                    <Text style={styles.featuresTitle}>Əlavə Xüsusiyyətlər</Text>

                    <View style={styles.featuresGrid}>
                        <TouchableOpacity
                            style={styles.featureButton}
                            onPress={() => router.push('/info/partners')}
                        >
                            <Ionicons name="business" size={24} color={Colors.primary} />
                            <Text style={styles.featureText}>Tərəfdaşlar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.featureButton}
                            onPress={() => router.push('/info/newcomers')}
                        >
                            <Ionicons name="people" size={24} color={Colors.success} />
                            <Text style={styles.featureText}>Yeni İstifadəçilər</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.featureButton}
                            onPress={() => console.log('Settings')}
                        >
                            <Ionicons name="settings" size={24} color={Colors.warning} />
                            <Text style={styles.featureText}>Tənzimləmələr</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.featureButton}
                            onPress={() => console.log('Help')}
                        >
                            <Ionicons name="help-circle" size={24} color={Colors.error} />
                            <Text style={styles.featureText}>Yardım</Text>
                        </TouchableOpacity>
                    </View>
                </View> */}

                {/* <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={20} color="#fff" />
                    <Text style={styles.logoutText}>Çıxış</Text>
                </TouchableOpacity> */}
            </View>
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
        // gap: 12,
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
    // offersSection: {
    //     paddingHorizontal: 20,
    //     marginBottom: 30,
    // },
    // offersHeader: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     marginBottom: 8,
    //     gap: 8,
    // },
    // offersTitle: {
    //     fontSize: 18,
    //     fontFamily: Fonts.Poppins_SemiBold,
    //     color: Colors.textPrimary,
    // },
    // offersSubtitle: {
    //     fontSize: 14,
    //     fontFamily: Fonts.Poppins_Regular,
    //     color: Colors.textSecondary,
    //     marginBottom: 16,
    // },
    // offersContainer: {
    //     gap: 16,
    // },
    // offerCard: {
    //     width: 160,
    //     height: 120,
    //     borderRadius: 12,
    //     padding: 16,
    //     marginRight: 16,
    // },
    // offerCardHeader: {
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    //     alignItems: 'flex-start',
    //     marginBottom: 20,
    // },
    // offerLogo: {
    //     fontSize: 32,
    // },
    // offerImage: {
    //     width: 40,
    //     height: 40,
    // },
    // offerCardContent: {
    //     flex: 1,
    //     justifyContent: 'flex-end',
    // },
    // offerBrand: {
    //     fontSize: 16,
    //     fontFamily: Fonts.Poppins_SemiBold,
    //     marginBottom: 4,
    // },
    // offerPrice: {
    //     fontSize: 14,
    //     fontFamily: Fonts.Poppins_Regular,
    //     color: Colors.textSecondary,
    // },
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
    // additionalFeatures: {
    //     paddingHorizontal: 20,
    //     marginBottom: 20,
    // },
    // featuresTitle: {
    //     fontSize: 18,
    //     fontFamily: Fonts.Poppins_SemiBold,
    //     color: Colors.textPrimary,
    //     marginBottom: 16,
    // },
    // featuresGrid: {
    //     flexDirection: 'row',
    //     flexWrap: 'wrap',
    //     gap: 12,
    // },
    // featureButton: {
    //     backgroundColor: '#fff',
    //     borderRadius: 12,
    //     padding: 16,
    //     alignItems: 'center',
    //     width: '47%',
    //     shadowColor: '#000',
    //     shadowOffset: {
    //         width: 0,
    //         height: 2,
    //     },
    //     shadowOpacity: 0.1,
    //     shadowRadius: 4,
    //     elevation: 3,
    // },
    // featureText: {
    //     fontSize: 14,
    //     fontFamily: Fonts.Poppins_Regular,
    //     color: Colors.textPrimary,
    //     marginTop: 8,
    //     textAlign: 'center',
    // },
});
