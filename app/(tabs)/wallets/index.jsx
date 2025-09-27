import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import CustomButton from '../../../components/CustomButton';
import { Colors, Fonts } from '../../../constants/theme';

export default function CardsScreen() {
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Hamısı');
    const [totalBalance, setTotalBalance] = useState(0);
    const [purchasedCards, setPurchasedCards] = useState([]);

    const categories = [
        { id: 'all', name: 'Hamısı', icon: 'grid-outline' },
        { id: 'clothing', name: 'Geyim', icon: 'shirt-outline' },
        { id: 'books', name: 'Kitab', icon: 'book-outline' },
        { id: 'electronics', name: 'Elektronika', icon: 'phone-portrait-outline' },
        { id: 'beauty', name: 'Gözəllik', icon: 'sparkles-outline' },
        { id: 'entertainment', name: 'Əyləncə', icon: 'game-controller-outline' },
    ];

    const cards = [
        {
            id: 1,
            title: 'Premium Geyim Kartı',
            price: 50,
            category: 'clothing',
            image: require('../../../assets/images/adidas.png'),
            description: 'Adidas və Puma brendləri üçün',
            backgroundColor: '#F5F5F5'
        },
        {
            id: 2,
            title: 'Kitab Həvəskarları',
            price: 25,
            category: 'books',
            image: require('../../../assets/images/alinino.png'),
            description: 'Alinino kitab mağazası',
            backgroundColor: '#E8F5E8'
        },
        {
            id: 3,
            title: 'Elektronika Pro',
            price: 100,
            category: 'electronics',
            logo: '📱',
            description: 'Smartfon və aksessuarlar',
            backgroundColor: '#E3F2FD'
        },
        {
            id: 4,
            title: 'Gözəllik Paket',
            price: 75,
            category: 'beauty',
            logo: '💄',
            description: 'Makiyaj və baxım məhsulları',
            backgroundColor: '#F3E5F5'
        },
        {
            id: 5,
            title: 'Oyun Dünyası',
            price: 40,
            category: 'entertainment',
            logo: '🎮',
            description: 'Oyun və əyləncə',
            backgroundColor: '#FFF3E0'
        },
        {
            id: 6,
            title: 'İdman Geyim',
            price: 60,
            category: 'clothing',
            image: require('../../../assets/images/puma.png'),
            description: 'Puma idman kolleksiyası',
            backgroundColor: '#F5F5F5'
        }
    ];

    const filteredCards = useMemo(() => {
        let filtered = cards;
        
        // Filter by category
        if (selectedCategory !== 'Hamısı') {
            const categoryKey = categories.find(cat => cat.name === selectedCategory)?.id;
            filtered = filtered.filter(card => card.category === categoryKey);
        }
        
        // Filter by search text
        if (searchText) {
            filtered = filtered.filter(card => 
                card.title.toLowerCase().includes(searchText.toLowerCase()) ||
                card.description.toLowerCase().includes(searchText.toLowerCase())
            );
        }
        
        return filtered;
    }, [searchText, selectedCategory]);

    const handleCategoryPress = (category) => {
        setSelectedCategory(category.name);
    };

    const handleBuyCard = (card) => {
        Alert.alert(
            'Kartı Satın Al',
            `${card.title} kartını ${card.price} ₼ qarşılığında almaq istəyirsiniz?`,
            [
                { text: 'Ləğv et', style: 'cancel' },
                {
                    text: 'Satın Al',
                    onPress: () => {
                        setTotalBalance(prev => prev + card.price);
                        setPurchasedCards(prev => [...prev, card.id]);
                        Alert.alert('Uğurlu!', `${card.title} kartı uğurla satın alındı!`);
                    }
                }
            ]
        );
    };

    const renderCard = ({ item }) => (
        <View style={[styles.card, { backgroundColor: item.backgroundColor }]}>
            <View style={styles.cardHeader}>
                {item.image ? (
                    <Image
                        source={item.image}
                        style={styles.cardImage}
                        resizeMode="contain"
                    />
                ) : (
                    <Text style={styles.cardLogo}>{item.logo}</Text>
                )}
                {purchasedCards.includes(item.id) && (
                    <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                )}
            </View>
            
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
                <Text style={styles.cardPrice}>{item.price} ₼</Text>
                
                <CustomButton
                    title={purchasedCards.includes(item.id) ? "Satın Alınıb" : "Satın Al"}
                    onPress={() => handleBuyCard(item)}
                    disabled={purchasedCards.includes(item.id)}
                    backgroundColor={purchasedCards.includes(item.id) ? Colors.success : Colors.primary}
                />
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header with Gradient Background */}
            <View style={styles.header}>
                <Text style={styles.title}>Kartlar</Text>
                <Text style={styles.subtitle}>Hədiyyə kartlarını kəşf edin</Text>
            </View>

            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* Balance Card */}
                <View style={styles.balanceCard}>
                    <Text style={styles.balanceLabel}>Cəmi Balans</Text>
                    <Text style={styles.balanceAmount}>{totalBalance.toFixed(2)} ₼</Text>
                    <Text style={styles.purchasedCount}>
                        {purchasedCards.length} kart satın alınıb
                    </Text>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={22} color={Colors.textSecondary} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Kartları axtar"
                            placeholderTextColor={Colors.textSecondary}
                            value={searchText}
                            onChangeText={setSearchText}
                        />
                    </View>
                    <TouchableOpacity style={styles.filterButton}>
                        <Ionicons name="filter" size={22} color={Colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Categories */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoriesContainer}
                    contentContainerStyle={styles.categoriesContent}
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

                {/* Cards List */}
                <View style={styles.cardsContainer}>
                    {filteredCards.map((item) => renderCard({ item }))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 30,
        backgroundColor: 'linear-gradient(135deg, #77BFA3 0%, #5EA88A 100%)',
    },
    title: {
        fontSize: 32,
        fontFamily: Fonts.Poppins_SemiBold,
        color: '#fff',
        marginBottom: 8,
        textShadowColor: 'rgba(0,0,0,0.1)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: Fonts.Poppins_Regular,
        color: 'rgba(255,255,255,0.9)',
    },
    balanceCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        marginHorizontal: 20,
        marginTop: -20,
        marginBottom: 24,
        alignItems: 'center',
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
    },
    balanceLabel: {
        fontSize: 14,
        fontFamily: Fonts.Poppins_Regular,
        color: Colors.textSecondary,
        marginBottom: 8,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    balanceAmount: {
        fontSize: 36,
        fontFamily: Fonts.Poppins_SemiBold,
        color: Colors.primary,
        marginBottom: 8,
        textShadowColor: 'rgba(119, 191, 163, 0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    purchasedCount: {
        fontSize: 14,
        fontFamily: Fonts.Poppins_Regular,
        color: Colors.success,
        backgroundColor: 'rgba(153, 209, 164, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    searchContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginBottom: 20,
        gap: 12,
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
        marginBottom: 24,
    },
    categoriesContent: {
        paddingHorizontal: 20,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 25,
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.08)',
        gap: 8,
        marginRight: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    categoryButtonActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
        shadowColor: Colors.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    categoryText: {
        fontSize: 14,
        fontFamily: Fonts.Poppins_Regular,
        color: Colors.textSecondary,
    },
    categoryTextActive: {
        color: '#fff',
    },
    cardsContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    cardRow: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
        minHeight: 240,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.03)',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    cardImage: {
        width: 48,
        height: 48,
        borderRadius: 8,
    },
    cardLogo: {
        fontSize: 36,
        textShadowColor: 'rgba(0,0,0,0.1)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    cardContent: {
        flex: 1,
        justifyContent: 'space-between',
    },
    cardTitle: {
        fontSize: 18,
        fontFamily: Fonts.Poppins_SemiBold,
        color: Colors.textPrimary,
        marginBottom: 8,
        lineHeight: 24,
    },
    cardDescription: {
        fontSize: 13,
        fontFamily: Fonts.Poppins_Regular,
        color: Colors.textSecondary,
        marginBottom: 16,
        lineHeight: 18,
    },
    cardPrice: {
        fontSize: 20,
        fontFamily: Fonts.Poppins_SemiBold,
        color: Colors.primary,
        marginBottom: 16,
        textShadowColor: 'rgba(119, 191, 163, 0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
});
