import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors, Fonts } from '../../constants/theme';

export default function QRScreen() {
    const router = useRouter();
    const [searchText, setSearchText] = useState('');
    const [, setSelectedCategory] = useState('Geyim mağazaları');

    const categories = [
        { id: 'clothing', name: 'Geyim mağazaları', icon: 'shirt-outline', active: true },
        { id: 'books', name: 'Kitab mağazaları', icon: 'book-outline', active: false },
        { id: 'markets', name: 'Marketlər', icon: 'basket-outline', active: false },
    ];

    const bestOffers = [
        {
            id: 1,
            brand: 'Adidas',
            category: 'Geyim',
            price: '50-100 ₼',
            image: require('../../assets/images/adidas.png'),
            description: 'İdman geyimləri',
            color: '#F5F5F5',
            accentColor: '#000000'
        },
        {
            id: 2,
            brand: 'Puma',
            category: 'Geyim',
            price: '50-100 ₼',
            image: require('../../assets/images/puma.png'),
            description: 'İdman geyimləri',
            color: '#F5F5F5',
            accentColor: '#000000'
        },
        {
            id: 3,
            brand: 'Olivia',
            category: 'Gözəllik',
            price: '50-100 ₼',
            logo: '💄',
            description: 'Gözəllik və qulluq',
            color: '#F5F5F5',
            accentColor: '#9C27B0'
        }
    ];

    const handleCategoryPress = (category) => {
        setSelectedCategory(category.name);
        console.log('Selected category:', category.name);
    };

    const handleOfferPress = (offer) => {
        Alert.alert('Təklif', `${offer.brand} təklifi seçildi`);
    };

    const handleScanQR = () => {
        Alert.alert('QR Kod', 'QR kod skan etmə funksiyası tezliklə əlavə ediləcək');
    };

    const handleGenerateQR = () => {
        Alert.alert('QR Kod', 'QR kod yaratma funksiyası tezliklə əlavə ediləcək');
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>QR Kod</Text>
                <Text style={styles.headerSubtitle}>Ən sərfəli təkliflər</Text>
            </View>

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
                style={styles.categoriesContainer}
                contentContainerStyle={styles.categoriesContent}
            >
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={[
                            styles.categoryButton,
                            category.active && styles.categoryButtonActive
                        ]}
                        onPress={() => handleCategoryPress(category)}
                    >
                        <Ionicons 
                            name={category.icon} 
                            size={20} 
                            color={category.active ? '#fff' : Colors.textSecondary} 
                        />
                        <Text style={[
                            styles.categoryText,
                            category.active && styles.categoryTextActive
                        ]}>
                            {category.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

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

            <View style={styles.qrActionsSection}>
                <Text style={styles.qrSectionTitle}>QR Kod Əməliyyatları</Text>
                
                <View style={styles.qrActionsContainer}>
                    <TouchableOpacity style={styles.qrActionButton} onPress={handleScanQR}>
                        <Ionicons name="camera" size={24} color="#fff" />
                        <Text style={styles.qrActionButtonText}>QR Kod Skan Et</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.qrActionButton, styles.secondaryQrButton]} onPress={handleGenerateQR}>
                        <Ionicons name="qr-code-outline" size={24} color={Colors.primary} />
                        <Text style={[styles.qrActionButtonText, styles.secondaryQrButtonText]}>QR Kod Yarat</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.additionalFeatures}>
                <Text style={styles.featuresTitle}>Əlavə Xüsusiyyətlər</Text>
                
                <View style={styles.featuresGrid}>
                    <TouchableOpacity 
                        style={styles.featureButton}
                        onPress={() => router.push('/partners')}
                    >
                        <Ionicons name="business" size={24} color={Colors.primary} />
                        <Text style={styles.featureText}>Tərəfdaşlar</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.featureButton}
                        onPress={() => router.push('/newcomers')}
                    >
                        <Ionicons name="people" size={24} color={Colors.success} />
                        <Text style={styles.featureText}>Yeni İstifadəçilər</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                    <Ionicons name="shield-checkmark" size={20} color={Colors.success} />
                    <Text style={styles.infoText}>Təhlükəsiz ödəniş</Text>
                </View>
                <View style={styles.infoItem}>
                    <Ionicons name="flash" size={20} color={Colors.warning} />
                    <Text style={styles.infoText}>Sürətli əməliyyat</Text>
                </View>
                <View style={styles.infoItem}>
                    <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                    <Text style={styles.infoText}>Etibarlı platforma</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        paddingBottom: 100,
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontFamily: Fonts.Poppins_SemiBold,
        color: Colors.textPrimary,
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        fontFamily: Fonts.Poppins_Regular,
        color: Colors.textSecondary,
    },
    searchContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 20,
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
    },
    categoriesContainer: {
        marginBottom: 20,
    },
    categoriesContent: {
        paddingHorizontal: 20,
        gap: 12,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        gap: 8,
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
    offersSection: {
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    offersHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    offersTitle: {
        fontSize: 18,
        fontFamily: Fonts.Poppins_SemiBold,
        color: Colors.textPrimary,
    },
    offersSubtitle: {
        fontSize: 14,
        fontFamily: Fonts.Poppins_Regular,
        color: Colors.textSecondary,
        marginBottom: 16,
    },
    offersContainer: {
        gap: 16,
    },
    offerCard: {
        width: 160,
        height: 120,
        borderRadius: 12,
        padding: 16,
        marginRight: 16,
    },
    offerCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    offerLogo: {
        fontSize: 32,
    },
    offerImage: {
        width: 40,
        height: 40,
    },
    offerCardContent: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    offerBrand: {
        fontSize: 16,
        fontFamily: Fonts.Poppins_SemiBold,
        marginBottom: 4,
    },
    offerPrice: {
        fontSize: 14,
        fontFamily: Fonts.Poppins_Regular,
        color: Colors.textSecondary,
    },
    qrActionsSection: {
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    qrSectionTitle: {
        fontSize: 18,
        fontFamily: Fonts.Poppins_SemiBold,
        color: Colors.textPrimary,
        marginBottom: 16,
    },
    qrActionsContainer: {
        gap: 12,
    },
    qrActionButton: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    secondaryQrButton: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: Colors.primary,
    },
    qrActionButtonText: {
        color: '#fff',
        fontFamily: Fonts.Poppins_SemiBold,
        fontSize: 16,
    },
    secondaryQrButtonText: {
        color: Colors.primary,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    infoItem: {
        alignItems: 'center',
        flex: 1,
    },
    infoText: {
        fontSize: 12,
        fontFamily: Fonts.Poppins_Regular,
        color: Colors.textSecondary,
        marginTop: 8,
        textAlign: 'center',
    },
    additionalFeatures: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    featuresTitle: {
        fontSize: 18,
        fontFamily: Fonts.Poppins_SemiBold,
        color: Colors.textPrimary,
        marginBottom: 16,
    },
    featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    featureButton: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        width: '47%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    featureText: {
        fontSize: 14,
        fontFamily: Fonts.Poppins_Regular,
        color: Colors.textPrimary,
        marginTop: 8,
        textAlign: 'center',
    },
});
