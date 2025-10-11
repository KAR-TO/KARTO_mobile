import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Colors, Fonts } from '../constants/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const getIconName = (type) => {
    switch (type) {
        case 'success': return 'checkmark-circle';
        case 'warning': return 'warning';
        case 'error': return 'close-circle';
        default: return 'information-circle';
    }
};

const getIconColor = (type) => {
    switch (type) {
        case 'success': return '#4CAF50';
        case 'warning': return '#FF9800';
        case 'error': return '#F44336';
        default: return '#2196F3';
    }
};

const getGradientColors = (type) => {
    switch (type) {
        case 'success': return ['#4CAF50', '#66BB6A'];
        case 'warning': return ['#FF9800', '#FFB74D'];
        case 'error': return ['#F44336', '#EF5350'];
        default: return [Colors.primary, '#5EA88A'];
    }
};

class CustomAlertManager {
    static instance = null;
    static showAlert = null;
    static pendingQueue = [];

    static getInstance() {
        if (!this.instance) {
            this.instance = new CustomAlertManager();
        }
        return this.instance;
    }

    static show({ title, message, type = 'info', buttons = [], onDismiss }) {
        console.log('CustomAlertManager.show called with:', { title, message, type });
        if (this.showAlert) {
            this.showAlert({ title, message, type, buttons, onDismiss });
        } else {
            console.log('showAlert function not set yet, queuing alert');
            this.pendingQueue.push({ title, message, type, buttons, onDismiss });
        }
    }

    static setShowFunction(showFunction) {
        this.showAlert = showFunction;
        if (this.showAlert && this.pendingQueue.length) {
            const queued = [...this.pendingQueue];
            this.pendingQueue = [];
            queued.forEach((args) => {
                try {
                    this.showAlert(args);
                } catch (err) {
                    console.warn('Failed to show queued alert:', err);
                }
            });
        }
    }
}

const CustomAlert = () => {
    const [visible, setVisible] = useState(false);
    const [alertData, setAlertData] = useState({
        title: '',
        message: '',
        type: 'info',
        buttons: [],
        onDismiss: null
    });

    const scaleValue = useRef(new Animated.Value(0)).current;
    const opacityValue = useRef(new Animated.Value(0)).current;

    const showAlert = useCallback(({ title, message, type = 'info', buttons = [], onDismiss }) => {
        console.log('showAlert function called with:', { title, message, type });
        setAlertData({ title, message, type, buttons, onDismiss });
        setVisible(true);

        Animated.parallel([
            Animated.spring(scaleValue, {
                toValue: 1,
                useNativeDriver: true,
                tension: 100,
                friction: 8,
            }),
            Animated.timing(opacityValue, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    useEffect(() => {
        console.log('Setting showAlert function in CustomAlertManager');
        CustomAlertManager.setShowFunction(showAlert);
        return () => {
            console.log('Cleaning up showAlert function');
            CustomAlertManager.setShowFunction(null);
        };
    }, [showAlert]);

    const hideAlert = (callback) => {
        Animated.parallel([
            Animated.spring(scaleValue, {
                toValue: 0,
                useNativeDriver: true,
                tension: 100,
                friction: 8,
            }),
            Animated.timing(opacityValue, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setVisible(false);
            if (callback) callback();
            if (alertData.onDismiss) alertData.onDismiss();
        });
    };



    const renderButtons = () => {
        if (alertData.buttons.length === 0) {
            return (
                <TouchableOpacity
                    style={styles.singleButton}
                    onPress={() => hideAlert()}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={getGradientColors(alertData.type)}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.buttonGradient}
                    >
                        <Text style={styles.buttonText}>OK</Text>
                    </LinearGradient>
                </TouchableOpacity>
            );
        }

        return (
            <View style={styles.buttonsContainer}>
                {alertData.buttons.map((button, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.button,
                            alertData.buttons.length === 1 && styles.singleButton,
                            button.style === 'cancel' && styles.cancelButton
                        ]}
                        onPress={() => {
                            hideAlert(() => {
                                if (button.onPress) button.onPress();
                            });
                        }}
                        activeOpacity={0.8}
                    >
                        {button.style === 'cancel' ? (
                            <View style={styles.cancelButtonBackground}>
                                <Text style={styles.cancelButtonText}>{button.text}</Text>
                            </View>
                        ) : (
                            <LinearGradient
                                colors={getGradientColors(alertData.type)}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.buttonGradient}
                            >
                                <Text style={styles.buttonText}>{button.text}</Text>
                            </LinearGradient>
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    if (!visible) return null;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            statusBarTranslucent
            onRequestClose={() => hideAlert()}
        >
            <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />
            <Animated.View style={[styles.overlay, { opacity: opacityValue }]}>
                <TouchableOpacity
                    style={styles.overlayTouch}
                    activeOpacity={1}
                    onPress={() => hideAlert()}
                >
                    <Animated.View
                        style={[
                            styles.alertContainer,
                            { transform: [{ scale: scaleValue }] }
                        ]}
                        onStartShouldSetResponder={() => true}
                    >
                        <View style={styles.alertContent}>
                            <View style={styles.iconContainer}>
                                <View style={[styles.iconBackground, { backgroundColor: getIconColor(alertData.type) + '20' }]}>
                                    <Ionicons
                                        name={getIconName(alertData.type)}
                                        size={32}
                                        color={getIconColor(alertData.type)}
                                    />
                                </View>
                            </View>

                            <Text style={styles.alertTitle}>{alertData.title}</Text>
                            <Text style={styles.alertMessage}>{alertData.message}</Text>

                            {renderButtons()}
                        </View>
                    </Animated.View>
                </TouchableOpacity>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayTouch: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    alertContainer: {
        width: '100%',
        maxWidth: 340,
        backgroundColor: 'white',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 15,
    },
    alertContent: {
        padding: 24,
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 16,
    },
    iconBackground: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertTitle: {
        fontSize: 20,
        fontFamily: Fonts.bold,
        color: Colors.textPrimary || '#333333',
        textAlign: 'center',
        marginBottom: 8,
    },
    alertMessage: {
        fontSize: 16,
        fontFamily: Fonts.Poppins_Regular,
        color: Colors.textSecondary || '#666666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    buttonsContainer: {
        width: '100%',
        flexDirection: 'row',
        gap: 12,
    },
    button: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        overflow: 'hidden',
    },
    singleButton: {
        width: '100%',
        flex: undefined,
    },
    buttonGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontFamily: Fonts.bold,
        color: '#FFFFFF',
    },
    cancelButton: {
        backgroundColor: 'transparent',
    },
    cancelButtonBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
    },
    cancelButtonText: {
        fontSize: 16,
        fontFamily: Fonts.Poppins_SemiBold,
        color: '#666666',
    },
});

// Export both the component and the manager
export { CustomAlertManager };
export default CustomAlert;
