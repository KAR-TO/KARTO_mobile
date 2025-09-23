import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Fonts } from '../../constants/theme';

export default function WalletScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Balans</Text>
                <Text style={styles.subtitle}>Balansınızı idarə edin</Text>
            </View>

            <View style={styles.balanceCard}>
                <Text style={styles.balanceLabel}>Cari Balans</Text>
                <Text style={styles.balanceAmount}>0.00 ₼</Text>
            </View>

            <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="add-circle" size={24} color={Colors.primary} />
                    <Text style={styles.actionText}>Balans Artır</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="arrow-up" size={24} color={Colors.primary} />
                    <Text style={styles.actionText}>Göndər</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="arrow-down" size={24} color={Colors.primary} />
                    <Text style={styles.actionText}>Qəbul Et</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.historyContainer}>
                <Text style={styles.historyTitle}>Son Əməliyyatlar</Text>
                <View style={styles.emptyState}>
                    <Ionicons name="receipt-outline" size={48} color={Colors.textSecondary} />
                    <Text style={styles.emptyText}>Hələ əməliyyat yoxdur</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 20,
        paddingBottom: 120,
    },
    header: {
        marginTop: 60,
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontFamily: Fonts.Poppins_SemiBold,
        color: Colors.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: Fonts.Poppins_Regular,
        color: Colors.textSecondary,
    },
    balanceCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    balanceLabel: {
        fontSize: 16,
        fontFamily: Fonts.Poppins_Regular,
        color: Colors.textSecondary,
        marginBottom: 8,
    },
    balanceAmount: {
        fontSize: 32,
        fontFamily: Fonts.Poppins_SemiBold,
        color: Colors.primary,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 30,
    },
    actionButton: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        minWidth: 80,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    actionText: {
        fontSize: 12,
        fontFamily: Fonts.Poppins_Regular,
        color: Colors.textPrimary,
        marginTop: 8,
        textAlign: 'center',
    },
    historyContainer: {
        flex: 1,
    },
    historyTitle: {
        fontSize: 18,
        fontFamily: Fonts.Poppins_SemiBold,
        color: Colors.textPrimary,
        marginBottom: 16,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        fontFamily: Fonts.Poppins_Regular,
        color: Colors.textSecondary,
        marginTop: 16,
    },
});
