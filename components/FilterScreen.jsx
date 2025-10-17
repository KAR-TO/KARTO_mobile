import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
    Dimensions,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Modal from 'react-native-modal';
import { Colors, Fonts } from '../constants/theme';
import { CustomAlertManager } from './CustomAlert';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const FilterScreen = ({ visible, onClose, onApplyFilters }) => {

    // Filter state
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [brandSearchText, setBrandSearchText] = useState('');
    const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

    // Categories data
    const categories = [
        { id: 'all', name: 'Hamısı', icon: 'grid-outline' },
        { id: 'clothing', name: 'Geyim', icon: 'shirt-outline' },
        { id: 'books', name: 'Kitab', icon: 'book-outline' },
        { id: 'electronics', name: 'Elektronika', icon: 'phone-portrait-outline' },
        { id: 'beauty', name: 'Gözəllik', icon: 'sparkles-outline' },
        { id: 'entertainment', name: 'Əyləncə', icon: 'game-controller-outline' },
        { id: 'sports', name: 'İdman', icon: 'basketball-outline' },
        { id: 'food', name: 'Yemək', icon: 'restaurant-outline' },
        { id: 'travel', name: 'Səyahət', icon: 'airplane-outline' },
    ];

    // Brands data
    const allBrands = [
        { id: 'adidas', name: 'Adidas', category: 'clothing' },
        { id: 'puma', name: 'Puma', category: 'clothing' },
        { id: 'nike', name: 'Nike', category: 'clothing' },
        { id: 'alinino', name: 'Ali & Nino', category: 'books' },
        { id: 'samsung', name: 'Samsung', category: 'electronics' },
        { id: 'apple', name: 'Apple', category: 'electronics' },
        { id: 'xiaomi', name: 'Xiaomi', category: 'electronics' },
        { id: 'loreal', name: "L'Oréal", category: 'beauty' },
        { id: 'chanel', name: 'Chanel', category: 'beauty' },
        { id: 'maybelline', name: 'Maybelline', category: 'beauty' },
        { id: 'mcdonalds', name: "McDonald's", category: 'food' },
        { id: 'kfc', name: 'KFC', category: 'food' },
        { id: 'starbucks', name: 'Starbucks', category: 'food' },
        { id: 'playstation', name: 'PlayStation', category: 'entertainment' },
        { id: 'netflix', name: 'Netflix', category: 'entertainment' },
        { id: 'spotify', name: 'Spotify', category: 'entertainment' },
    ];

    // Price ranges
    const priceRanges = [
        { id: 'under25', label: '25 ₼-dən aşağı', min: 0, max: 25 },
        { id: '25-50', label: '25 - 50 ₼', min: 25, max: 50 },
        { id: '50-100', label: '50 - 100 ₼', min: 50, max: 100 },
        { id: '100-200', label: '100 - 200 ₼', min: 100, max: 200 },
        { id: 'over200', label: '200 ₼-dən yuxarı', min: 200, max: 999999 },
    ];

    // Filter brands based on search text
    const filteredBrands = allBrands.filter(brand =>
        brand.name.toLowerCase().includes(brandSearchText.toLowerCase())
    );

    // Handle category selection
    const toggleCategory = (categoryId) => {
        if (categoryId === 'all') {
            // If "All" is selected, clear other selections
            setSelectedCategories(['all']);
        } else {
            // Remove "All" if it was selected and add/remove the specific category
            const newCategories = selectedCategories.filter(id => id !== 'all');
            if (selectedCategories.includes(categoryId)) {
                setSelectedCategories(newCategories.filter(id => id !== categoryId));
            } else {
                setSelectedCategories([...newCategories, categoryId]);
            }
        }
    };

    // Handle brand selection
    const toggleBrand = (brandId) => {
        if (selectedBrands.includes(brandId)) {
            setSelectedBrands(selectedBrands.filter(id => id !== brandId));
        } else {
            setSelectedBrands([...selectedBrands, brandId]);
        }
    };

    // Handle price range selection
    const selectPriceRange = (range) => {
        setPriceRange({ min: range.min.toString(), max: range.max.toString() });
    };

    // Reset all filters
    const resetFilters = () => {
        setSelectedCategories([]);
        setPriceRange({ min: '', max: '' });
        setSelectedBrands([]);
        setBrandSearchText('');
        setShowOnlyAvailable(false);
    };

    // Apply filters
    const applyFilters = () => {
        // Validate price range
        const minPrice = parseFloat(priceRange.min) || 0;
        const maxPrice = parseFloat(priceRange.max) || 999999;

        if (minPrice > maxPrice) {
            CustomAlertManager.show({
                title: 'Xəta',
                message: 'Minimum qiymət maksimum qiymətdən böyük ola bilməz',
                type: 'error'
            });
            return;
        }

        const filters = {
            categories: selectedCategories,
            priceRange: {
                min: minPrice,
                max: maxPrice
            },
            brands: selectedBrands,
            showOnlyAvailable
        };

        onApplyFilters(filters);
        onClose();
    };

    return (
        <Modal
            isVisible={visible}
            onBackdropPress={onClose}
            onBackButtonPress={onClose}
            style={styles.modal}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            animationInTiming={800}
            animationOutTiming={600}
            backdropOpacity={0.4}
            backdropTransitionInTiming={800}
            backdropTransitionOutTiming={600}
            useNativeDriverForBackdrop={true}
            hideModalContentWhileAnimating={true}
            propagateSwipe={true}
        >
            <View style={styles.modalContainer}>
                {/* Header */}
                <LinearGradient
                    colors={["#B6EBC1", "#99D1A4", "#7DC490"]}
                    style={styles.header}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.headerLeft}>
                        <Text style={styles.headerTitle}>FILTR</Text>
                    </View>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color="#fff" />
                    </TouchableOpacity>
                </LinearGradient>

                <ScrollView
                    style={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    bounces={true}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Categories Section */}
                    <View style={styles.filterSection}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="apps" size={18} color={Colors.primary} />
                            <Text style={styles.sectionTitle}>Kateqoriyalar</Text>
                        </View>
                        <View style={styles.categoriesGrid}>
                            {categories.map((category) => (
                                <TouchableOpacity
                                    key={category.id}
                                    style={[
                                        styles.categoryChip,
                                        selectedCategories.includes(category.id) && styles.categoryChipSelected
                                    ]}
                                    onPress={() => toggleCategory(category.id)}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons
                                        name={category.icon}
                                        size={16}
                                        color={selectedCategories.includes(category.id) ? '#fff' : Colors.textSecondary}
                                    />
                                    <Text style={[
                                        styles.categoryChipText,
                                        selectedCategories.includes(category.id) && styles.categoryChipTextSelected
                                    ]}>
                                        {category.name}
                                    </Text>
                                    {selectedCategories.includes(category.id) && (
                                        <Ionicons name="checkmark-circle" size={16} color="#fff" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Price Range Section */}
                    <View style={styles.filterSection}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="pricetag" size={18} color={Colors.primary} />
                            <Text style={styles.sectionTitle}>Qiymət aralığı</Text>
                        </View>

                        {/* Quick Price Ranges */}
                        <View style={styles.priceRangesContainer}>
                            {priceRanges.map((range) => (
                                <TouchableOpacity
                                    key={range.id}
                                    style={[
                                        styles.priceRangeChip,
                                        (priceRange.min === range.min.toString() && priceRange.max === range.max.toString()) && styles.priceRangeChipSelected
                                    ]}
                                    onPress={() => selectPriceRange(range)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[
                                        styles.priceRangeText,
                                        (priceRange.min === range.min.toString() && priceRange.max === range.max.toString()) && styles.priceRangeTextSelected
                                    ]}>
                                        {range.label}
                                    </Text>
                                    {(priceRange.min === range.min.toString() && priceRange.max === range.max.toString()) && (
                                        <Ionicons name="checkmark" size={16} color="#fff" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Custom Price Range */}
                        <View style={styles.customPriceContainer}>
                            <Text style={styles.customPriceLabel}>Və ya öz aralığınızı daxil edin:</Text>
                            <View style={styles.priceInputsContainer}>
                                <View style={styles.priceInputWrapper}>
                                    <TextInput
                                        style={styles.priceInput}
                                        placeholder="Min"
                                        placeholderTextColor={Colors.textSecondary}
                                        value={priceRange.min}
                                        onChangeText={(text) => setPriceRange(prev => ({ ...prev, min: text }))}
                                        keyboardType="numeric"
                                    />
                                    <Text style={styles.currencyText}>₼</Text>
                                </View>

                                <View style={styles.priceSeparator}>
                                    <Text style={styles.separatorText}>-</Text>
                                </View>

                                <View style={styles.priceInputWrapper}>
                                    <TextInput
                                        style={styles.priceInput}
                                        placeholder="Max"
                                        placeholderTextColor={Colors.textSecondary}
                                        value={priceRange.max}
                                        onChangeText={(text) => setPriceRange(prev => ({ ...prev, max: text }))}
                                        keyboardType="numeric"
                                    />
                                    <Text style={styles.currencyText}>₼</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Brands Section */}
                    <View style={styles.filterSection}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="diamond" size={18} color={Colors.primary} />
                            <Text style={styles.sectionTitle}>Brendlər</Text>
                        </View>

                        {/* Brand Search */}
                        <View style={styles.brandSearchContainer}>
                            <Ionicons name="search" size={20} color={Colors.textSecondary} />
                            <TextInput
                                style={styles.brandSearchInput}
                                placeholder="Brend axtar..."
                                placeholderTextColor={Colors.textSecondary}
                                value={brandSearchText}
                                onChangeText={setBrandSearchText}
                            />
                            {brandSearchText.length > 0 && (
                                <TouchableOpacity
                                    onPress={() => setBrandSearchText('')}
                                    style={styles.clearSearchButton}
                                >
                                    <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Brands List */}
                        <View style={styles.brandsContainer}>
                            {filteredBrands.length > 0 ? filteredBrands.map((brand) => (
                                <TouchableOpacity
                                    key={brand.id}
                                    style={[
                                        styles.brandChip,
                                        selectedBrands.includes(brand.id) && styles.brandChipSelected
                                    ]}
                                    onPress={() => toggleBrand(brand.id)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[
                                        styles.brandChipText,
                                        selectedBrands.includes(brand.id) && styles.brandChipTextSelected
                                    ]}>
                                        {brand.name}
                                    </Text>
                                    {selectedBrands.includes(brand.id) && (
                                        <Ionicons name="checkmark-circle" size={16} color="#fff" />
                                    )}
                                </TouchableOpacity>
                            )) : (
                                <Text style={styles.noBrandsText}>Heç bir brend tapılmadı</Text>
                            )}
                        </View>
                    </View>

                    {/* Additional Options */}
                    <View style={styles.filterSection}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="settings" size={18} color={Colors.primary} />
                            <Text style={styles.sectionTitle}>Əlavə seçimlər</Text>
                        </View>

                        <View style={styles.optionRow}>
                            <View style={styles.optionContent}>
                                <View style={styles.optionTitleRow}>
                                    <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                                    <Text style={styles.optionTitle}>Yalnız mövcud olanları göstər</Text>
                                </View>
                                <Text style={styles.optionSubtitle}>Stokda olmayan məhsulları gizlə</Text>
                            </View>
                            <Switch
                                value={showOnlyAvailable}
                                onValueChange={setShowOnlyAvailable}
                                trackColor={{ false: '#E5E5E7', true: Colors.primary }}
                                thumbColor={showOnlyAvailable ? '#fff' : '#f4f3f4'}
                                ios_backgroundColor="#E5E5E7"
                            />
                        </View>
                    </View>

                    {/* Summary */}
                    <View style={styles.summarySection}>
                        <Text style={styles.summaryTitle}>Seçilmiş filtrlər:</Text>
                        <Text style={styles.summaryText}>
                            {selectedCategories.length > 0 ? `${selectedCategories.length} kateqoriya` : 'Kateqoriya yox'} •
                            {selectedBrands.length > 0 ? ` ${selectedBrands.length} brend` : ' Brend yox'} •
                            {(priceRange.min || priceRange.max) ? ' Qiymət aralığı' : ' Qiymət yox'}
                        </Text>
                    </View>
                </ScrollView>

                {/* Footer Buttons */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.resetButton}
                        onPress={resetFilters}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="refresh" size={18} color={Colors.textPrimary} />
                        <Text style={styles.resetButtonText}>Sıfırla</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.applyButtonWrapper}
                        onPress={applyFilters}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={["#7DC490", "#99D1A4", "#aaebb7ff"]}
                            style={styles.applyButton}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Ionicons name="checkmark" size={18} color="#fff" />
                            <Text style={styles.applyButtonText}>Tətbiq et</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        margin: 0,
        justifyContent: 'center',
    },
    modalContainer: {
        backgroundColor: '#FAFBFC',
        flex: 1,
        width: screenWidth,
        height: screenHeight,
        shadowColor: '#77BFA3',
        shadowOffset: {
            width: -4,
            height: 0,
        },
        shadowOpacity: 0.3,
        shadowRadius: 25,
        elevation: 25,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        paddingTop: Platform === 'ios' ? 10 : 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.2)',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: Fonts.Poppins_SemiBold,
        color: '#fff',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        // textTransform: 'uppercase',
    },
    closeButton: {
        padding: 8,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    filterSection: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: Fonts.Poppins_SemiBold,
        color: Colors.textPrimary,
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        gap: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    categoryChipSelected: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
        transform: [{ scale: 1.05 }],
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    categoryChipText: {
        fontSize: 14,
        fontFamily: Fonts.Poppins_Regular,
        color: Colors.textSecondary,
    },
    categoryChipTextSelected: {
        color: '#fff',
        fontFamily: Fonts.Poppins_SemiBold,
    },
    priceRangesContainer: {
        gap: 12,
        marginBottom: 20,
    },
    priceRangeChip: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    priceRangeChipSelected: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
        transform: [{ scale: 1.02 }],
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 3,
    },
    priceRangeText: {
        fontSize: 15,
        fontFamily: Fonts.Poppins_Regular,
        color: Colors.textPrimary,
    },
    priceRangeTextSelected: {
        color: '#fff',
        fontFamily: Fonts.Poppins_SemiBold,
    },
    customPriceContainer: {
        marginTop: 16,
    },
    customPriceLabel: {
        fontSize: 14,
        fontFamily: Fonts.Poppins_Regular,
        color: Colors.textSecondary,
        marginBottom: 12,
    },
    priceInputsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    priceInputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        paddingHorizontal: 16,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    priceInput: {
        flex: 1,
        height: 50,
        fontSize: 16,
        fontFamily: Fonts.Poppins_Regular,
        color: Colors.textPrimary,
    },
    currencyText: {
        fontSize: 16,
        fontFamily: Fonts.Poppins_SemiBold,
        color: Colors.primary,
        marginLeft: 8,
    },
    priceSeparator: {
        paddingHorizontal: 8,
    },
    separatorText: {
        fontSize: 18,
        fontFamily: Fonts.Poppins_SemiBold,
        color: Colors.textSecondary,
    },
    brandSearchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        paddingHorizontal: 16,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    brandSearchInput: {
        flex: 1,
        height: 50,
        marginLeft: 12,
        fontSize: 16,
        fontFamily: Fonts.Poppins_Regular,
        color: Colors.textPrimary,
    },
    clearSearchButton: {
        padding: 4,
    },
    brandsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    brandChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        gap: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    brandChipSelected: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
        transform: [{ scale: 1.05 }],
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    brandChipText: {
        fontSize: 14,
        fontFamily: Fonts.Poppins_Regular,
        color: Colors.textSecondary,
    },
    brandChipTextSelected: {
        color: '#fff',
        fontFamily: Fonts.Poppins_SemiBold,
    },
    noBrandsText: {
        fontSize: 14,
        fontFamily: Fonts.Poppins_Regular,
        color: Colors.textSecondary,
        textAlign: 'center',
        paddingVertical: 20,
        fontStyle: 'italic',
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 16,
        borderWidth: 2,
        borderColor: '#E5E7EB',
    },
    optionContent: {
        flex: 1,
    },
    optionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    optionTitle: {
        fontSize: 16,
        fontFamily: Fonts.Poppins_SemiBold,
        color: Colors.textPrimary,
    },
    optionSubtitle: {
        fontSize: 13,
        fontFamily: Fonts.Poppins_Regular,
        color: Colors.textSecondary,
    },
    summarySection: {
        backgroundColor: '#F0F9FF',
        marginHorizontal: 24,
        borderRadius: 16,
        padding: 16,
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#E0F2FE',
    },
    summaryTitle: {
        fontSize: 14,
        fontFamily: Fonts.Poppins_SemiBold,
        color: Colors.primary,
        marginBottom: 4,
    },
    summaryText: {
        fontSize: 13,
        fontFamily: Fonts.Poppins_Regular,
        color: Colors.textSecondary,
    },
    footer: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        paddingVertical: 25,
        paddingBottom: 35,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        backgroundColor: '#fff',
        gap: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
    },
    resetButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        paddingVertical: 16,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        gap: 8,
    },
    resetButtonText: {
        fontSize: 16,
        fontFamily: Fonts.Poppins_SemiBold,
        color: Colors.textPrimary,
    },
    applyButtonWrapper: {
        flex: 2,
        borderRadius: 16,
        shadowColor: Colors.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    applyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        paddingVertical: 16,
        gap: 8,
    },
    applyButtonText: {
        fontSize: 16,
        fontFamily: Fonts.Poppins_SemiBold,
        color: '#fff',
    },
});

export default FilterScreen;
