import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import CustomButton from '../../../components/CustomButton';
import FilterScreen from '../../../components/FilterScreen';
import { Colors, Fonts } from '../../../constants/theme';

export default function CardsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Hamısı');
    const [totalBalance, setTotalBalance] = useState(0);
    const [purchasedCards, setPurchasedCards] = useState([]);
    const [filterVisible, setFilterVisible] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState(null);

    const categories = useMemo(() => [
        { id: 'all', name: 'Hamısı', icon: 'grid-outline' },
        { id: 'clothing', name: 'Geyim', icon: 'shirt-outline' },
        { id: 'books', name: 'Kitab', icon: 'book-outline' },
        { id: 'electronics', name: 'Elektronika', icon: 'phone-portrait-outline' },
        { id: 'beauty', name: 'Gözəllik', icon: 'sparkles-outline' },
        { id: 'entertainment', name: 'Əyləncə', icon: 'game-controller-outline' },
    ], []);

    const cards = useMemo(() => [
        {
            id: 1,
            title: 'Adidas',
            price: "50-100",
            category: 'clothing',
            image: require('../../../assets/images/adidas.png'),
            backgroundColor: '#F5F5F5'
        },
        {
            id: 2,
            title: 'Alinino',
            price: "25-50",
            category: 'books',
            image: require('../../../assets/images/alinino.png'),
            backgroundColor: '#E8F5E8'
        },
        {
            id: 3,
            title: 'Smartfon',
            price: 100,
            category: 'electronics',
            logo: '📱',
            backgroundColor: '#E3F2FD'
        },
        {
            id: 4,
            title: 'Gözəllik Paket',
            price: 75,
            category: 'beauty',
            logo: '💄',
            backgroundColor: '#F3E5F5'
        },
        {
            id: 5,
            title: 'Oyun Dünyası',
            price: 40,
            category: 'entertainment',
            logo: '🎮',
            backgroundColor: '#FFF3E0'
        },
        {
            id: 6,
            title: 'Puma',
            price: 60,
            category: 'clothing',
            image: require('../../../assets/images/puma.png'),
            backgroundColor: '#F5F5F5'
        }
    ], []);

    const filteredCards = useMemo(() => {
        let filtered = cards;

        if (selectedCategory !== 'Hamısı') {
            const categoryKey = categories.find(cat => cat.name === selectedCategory)?.id;
            filtered = filtered.filter(card => card.category === categoryKey);
        }

        if (searchText) {
            filtered = filtered.filter(card =>
                card.title.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        if (appliedFilters) {
            if (appliedFilters.categories.length > 0 && !appliedFilters.categories.includes('all')) {
                filtered = filtered.filter(card => 
                    appliedFilters.categories.includes(card.category)
                );
            }

            if (appliedFilters.priceRange) {
                filtered = filtered.filter(card => {
                    const cardPrice = typeof card.price === 'string' 
                        ? parseFloat(card.price.replace(/[^\d.-]/g, '')) 
                        : card.price;
                    return cardPrice >= appliedFilters.priceRange.min && 
                           cardPrice <= appliedFilters.priceRange.max;
                });
            }

            if (appliedFilters.brands.length > 0) {
                filtered = filtered.filter(card => 
                    appliedFilters.brands.some(brandId => 
                        card.title.toLowerCase().includes(brandId.toLowerCase())
                    )
                );
            }
        }

        return filtered;
    }, [searchText, selectedCategory, appliedFilters, categories, cards]);

    const handleCategoryPress = (category) => {
        setSelectedCategory(category.name);
    };

    const handleFilterPress = () => {
        setFilterVisible(true);
    };

    const handleApplyFilters = (filters) => {
        setAppliedFilters(filters);
    };

    const handleBuyCard = (card) => {
        const numericPrice = typeof card.price === 'string' 
            ? parseFloat(String(card.price).replace(/[^\d.-]/g, '')) 
            : Number(card.price || 0);
        setTotalBalance(prev => prev + (isNaN(numericPrice) ? 0 : numericPrice));
        setPurchasedCards(prev => prev.includes(card.id) ? prev : [...prev, card.id]);

        router.push({
            pathname: '/gift-purchase/selection',
            params: {
                brand: card.title,
                category: categories.find(c => c.id === card.category)?.name || '',
                price: typeof card.price === 'string' ? card.price : String(card.price)
            }
        });
    };

    const renderCard = ({ item }) => (
        <View style={[styles.card, { backgroundColor: item.backgroundColor }]}>
            <Text style={styles.cardTitle}>{item.title}</Text>

            <View style={styles.cardImageWrapper}>
                {item.image ? (
                    <Image
                        source={item.image}
                        style={styles.cardImage}
                        resizeMode="contain"
                    />
                ) : (
                    <Text style={styles.cardLogo}>{item.logo}</Text>
                )}
            </View>

            <View style={styles.cardFooter}>
                <Text style={styles.cardPrice}>{item.price} ₼</Text>
                {purchasedCards.includes(item.id) && (
                    <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={Colors.success}
                        style={{ marginLeft: 6 }}
                    />
                )}
            </View>

            <CustomButton
                title={purchasedCards.includes(item.id) ? "Satın Alınıb" : "Satın Al"}
                onPress={() => handleBuyCard(item)}
                disabled={purchasedCards.includes(item.id)}
                backgroundColor={
                    purchasedCards.includes(item.id) ? Colors.success : Colors.primary
                }
            />
        </View>
    );

    React.useEffect(() => {
        const catId = params?.category;
        const q = params?.q;
        const openFilter = params?.openFilter === '1';
        if (catId) {
            const matched = categories.find(c => c.id === catId);
            if (matched) setSelectedCategory(matched.name);
        }
        if (typeof q === 'string') {
            setSearchText(String(q));
        }
        if (openFilter) setFilterVisible(true);
    }, [params?.category, params?.q, params?.openFilter, categories]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Kartlar</Text>
                <Text style={styles.subtitle}>Hədiyyə kartlarını kəşf edin</Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 80 }}
            >
                <View style={[styles.balanceCard, styles.horizontalPadding]}>
                    <Text style={styles.balanceLabel}>Cəmi Balans</Text>
                    <View style={styles.balanceFooter}>
                        <View style={styles.purchasedCountWrapper}>
                            <Text style={styles.purchasedCount}>
                                {purchasedCards.length} kart satın alınıb
                            </Text>
                        </View>
                        <Text style={styles.balanceAmount}>{totalBalance.toFixed(2)} ₼</Text>
                    </View>

                </View>

                <View style={[styles.searchContainer, styles.horizontalPadding]}>
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={22} color={Colors.textSecondary} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Kartları axtar"
                            placeholderTextColor={Colors.textSecondary}
                            value={searchText}
                            onChangeText={setSearchText}
                            autoFocus={params?.focusSearch === '1'}
                            clearButtonMode="while-editing"
                        />
                        {searchText?.length ? (
                            <TouchableOpacity onPress={() => setSearchText('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
                            </TouchableOpacity>
                        ) : null}
                    </View>
                    <TouchableOpacity style={styles.filterButton} onPress={handleFilterPress}>
                        <Ionicons name="filter" size={22} color={Colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                {searchText ? (
                    <Text style={[styles.horizontalPadding, {color: Colors.textSecondary, fontFamily: Fonts.Poppins_Regular, marginBottom: 10}]}>Axtarış nəticəsi: “{searchText}”</Text>
                ) : null}

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoriesContainer}
                    contentContainerStyle={styles.categoriesContentContainer}
                >
                    {categories.map((category, index) => (
                        <TouchableOpacity
                            key={category.id}
                            style={[
                                styles.categoryButton,
                                selectedCategory === category.name && styles.categoryButtonActive,
                                index === 0 && { marginLeft: 0 },
                                index === categories.length - 1 && { marginRight: 0 }
                            ]}
                            onPress={() => handleCategoryPress(category)}
                        >
                            <Ionicons
                                name={category.icon}
                                size={18}
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

                <View style={[styles.cardsContainer, styles.horizontalPadding]}>
                    {filteredCards.map((item) =>
                        <View key={item.id}>
                            {renderCard({ item })}
                        </View>
                    )}
                </View>
            </ScrollView>
            
            <FilterScreen
                visible={filterVisible}
                onClose={() => setFilterVisible(false)}
                onApplyFilters={handleApplyFilters}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 10 : 50,
        paddingBottom: 10,
        paddingHorizontal: 12,
        backgroundColor: 'linear-gradient(135deg, #77BFA3 0%, #5EA88A 100%)',
    },
    title: {
        fontSize: 32,
        fontFamily: Fonts.Poppins_SemiBold,
        color: Colors.primary,
        textShadowColor: 'rgba(0,0,0,0.1)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: Fonts.Poppins_Regular,
        color: Colors.primary,
    },
    balanceCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 10,
        marginBottom: 24,
        shadowColor: '#77BFA3',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
        borderWidth: 1,
        borderColor: 'rgba(119, 191, 163, 0.1)',
        marginHorizontal: 10,
    },
    balanceLabel: {
        fontSize: 10,
        fontFamily: Fonts.Poppins_Regular,
        color: Colors.textSecondary,
        textTransform: 'uppercase',
    },
    balanceFooter: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    balanceAmount: {
        fontSize: 28,
        fontFamily: Fonts.Poppins_SemiBold,
        color: Colors.primary,
        textShadowColor: 'rgba(18, 18, 18, 0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    purchasedCountWrapper: {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        borderRadius: 12,
        paddingHorizontal: 12,
        shadowColor: '#00603bf6',
        shadowOffset: { width: 0, height: 12 }, 
        shadowOpacity: 0.7,
        shadowRadius: 20,
        elevation: 12,
    },
    purchasedCount: {
        fontSize: 14,
        fontFamily: Fonts.Poppins_Regular,
        color: Colors.primary,
        textAlign: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 10,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingHorizontal: 18,
        height: 52,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        fontFamily: Fonts.Poppins_Regular,
        color: Colors.textPrimary,
    },
    filterButton: {
        width: 52,
        height: 52,
        backgroundColor: '#fff',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    categoriesContainer: {
        marginBottom: 20,
        paddingBottom: 5,
    },
    categoriesContentContainer: {
        paddingHorizontal: 12,
    },
    horizontalPadding: {
        paddingHorizontal: 12,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.08)',
        gap: 5,
        marginRight: 10,
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
        shadowColor: Colors.primary,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 7,
    },
    categoryText: {
        fontSize: 14,
        fontFamily: Fonts.Poppins_Regular,
        color: Colors.textSecondary,
    },
    categoryTextActive: {
        color: '#fff',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 4,

        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    cardTitle: {
        fontSize: 18,
        fontFamily: Fonts.Poppins_SemiBold,
        color: Colors.textPrimary,
        textAlign: 'center',
    },
    cardPrice: {
        fontSize: 20,
        fontFamily: Fonts.Poppins_SemiBold,
        color: Colors.primary,
    },
    cardImageWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    cardImage: {
        width: 150,
        height: 90,
    },
    cardLogo: {
        fontSize: 36,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 5,
        marginTop: 6,
    },
});
