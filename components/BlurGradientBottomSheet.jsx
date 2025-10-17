import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Dimensions, Platform, Pressable, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    Extrapolation,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

/**
 * BlurGradientBottomSheet
 *
 * A modern bottom-sheet modal for Expo managed workflow.
 * - Smooth spring slide-up on open, slide-down on close
 * - Semi-transparent blurred backdrop that darkens the screen
 * - Drag down with a top handle to close (Reanimated + Gesture Handler)
 * - LinearGradient background with rounded corners and subtle shadow
 *
 * Props
 * - visible: boolean (controlled visibility)
 * - onClose: () => void (called after close animation completes)
 * - height?: number (sheet height; default 420)
 * - fullScreen?: boolean (if true, sheet covers full screen)
 * - blurIntensity?: number (default 35)
 * - blurTint?: 'dark' | 'light' | 'default' (default 'dark')
 * - enableBackdropPress?: boolean (default true)
 * - colors?: string[] (LinearGradient colors; default blue→purple)
 * - coverPercentage?: number (0-1). If provided, caps height to a percentage of screen (default 0.9)
 * - children: ReactNode (content inside the sheet)
 */
const BlurGradientBottomSheet = ({
    visible,
    onClose,
    children,
    height = 420,
    fullScreen = false,
    blurIntensity = 35,
    blurTint = "dark",
    enableBackdropPress = true,
    // future: enableFullAreaDrag can allow dragging from anywhere when content is scrolled to top
    enableFullAreaDrag = false,
    colors = ["#1f3b73", "#6d28d9"],
    coverPercentage,
}) => {
    const insets = useSafeAreaInsets();
    const ratio = typeof coverPercentage === "number" && coverPercentage > 0 && coverPercentage <= 1 ? coverPercentage : null;
    let computedHeight = SCREEN_HEIGHT;
    if (!fullScreen) {
        if (ratio === null) {
            computedHeight = Math.min(height + insets.bottom, SCREEN_HEIGHT * 0.9);
        } else {
            computedHeight = Math.min(SCREEN_HEIGHT * ratio, SCREEN_HEIGHT);
        }
    }
    const sheetHeight = computedHeight;

    // Animation values
    const translateY = useSharedValue(sheetHeight);
    const backdrop = useSharedValue(0); // 0 -> hidden, 1 -> visible
    const isAnimating = useSharedValue(false);
    const [mounted, setMounted] = useState(false);

    // Open/Close animations
    const animateOpen = useCallback(() => {
        isAnimating.value = true;
        backdrop.value = withTiming(1, { duration: 220 });
        translateY.value = withSpring(0, {
            damping: 18,
            stiffness: 180,
            mass: 0.8,
            overshootClamping: false,
            restDisplacementThreshold: 0.5,
            restSpeedThreshold: 0.5,
        }, () => {
            isAnimating.value = false;
        });
    }, [backdrop, translateY, isAnimating]);

    const afterClose = useCallback(() => {
        onClose?.();
    }, [onClose]);

    const animateCloseInternal = useCallback((options) => {
        const opts = { callOnClose: true, unmount: true };
        if (options && typeof options === "object") {
            if (Object.hasOwn(options, "callOnClose")) {
                opts.callOnClose = options.callOnClose;
            }
            if (Object.hasOwn(options, "unmount")) {
                opts.unmount = options.unmount;
            }
        }
        if (isAnimating.value) return;
        isAnimating.value = true;
        backdrop.value = withTiming(0, { duration: 200 });
        translateY.value = withTiming(sheetHeight, { duration: 250 }, () => {
            isAnimating.value = false;
            if (opts.unmount) {
                runOnJS(setMounted)(false);
            }
            if (opts.callOnClose) {
                runOnJS(afterClose)();
            }
        });
    }, [afterClose, backdrop, setMounted, sheetHeight, translateY, isAnimating]);

    // React to visibility changes
    useEffect(() => {
        if (visible) {
            runOnJS(setMounted)(true);
            translateY.value = sheetHeight;
            animateOpen();
        } else if (mounted) {
            animateCloseInternal({ callOnClose: false, unmount: true });
        }
    }, [visible]);

    const startY = useSharedValue(0);
    const pan = useMemo(() =>
        Gesture.Pan()
            .onBegin(() => {
                startY.value = translateY.value;
            })
            .onUpdate((evt) => {
                const next = startY.value + evt.translationY;
                translateY.value = Math.min(Math.max(next, 0), sheetHeight);
                const progress = interpolate(translateY.value, [0, sheetHeight], [1, 0.1], Extrapolation.CLAMP);
                backdrop.value = progress;
            })
            .onEnd((evt) => {
                const shouldClose = evt.velocityY > 900 || translateY.value > sheetHeight * 0.35;
                if (shouldClose) {
                    backdrop.value = withTiming(0, { duration: 180 });
                    translateY.value = withTiming(sheetHeight, { duration: 240 }, () => {
                        runOnJS(setMounted)(false);
                        runOnJS(afterClose)();
                    });
                } else {
                    backdrop.value = withTiming(1, { duration: 180 });
                    translateY.value = withSpring(0, {
                        damping: 18,
                        stiffness: 180,
                    });
                }
            })
        , [afterClose, backdrop, sheetHeight, startY, translateY]);

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: interpolate(backdrop.value, [0, 1], [0, 1], Extrapolation.CLAMP),
    }));

    const sheetStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const shouldRender = visible || mounted || isAnimating.value;
    if (!shouldRender) return null;

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
            <Animated.View style={[StyleSheet.absoluteFill, styles.backdropContainer, backdropStyle]}>
                <BlurView tint={blurTint} intensity={blurIntensity} style={StyleSheet.absoluteFill} />
                {enableBackdropPress && (
                    <Pressable onPress={() => animateCloseInternal({ callOnClose: true, unmount: true })} style={StyleSheet.absoluteFill} />
                )}
            </Animated.View>

            <Animated.View pointerEvents="box-none" style={[styles.sheetWrapper, { height: sheetHeight }, sheetStyle]}>
                <LinearGradient
                    colors={colors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                        styles.sheet,
                        fullScreen ? styles.sheetFull : null,
                        {
                            paddingBottom: Math.max(insets.bottom, 16),
                            paddingTop: (fullScreen ? insets.top : 0) + 10,
                        },
                    ]}
                >
                    {/* Handle bar (drag to close) */}
                    <GestureDetector gesture={pan}>
                        <View style={styles.handleContainer}>
                            <View style={styles.handle} />
                        </View>
                    </GestureDetector>

                    {/* Content */}
                    <View style={styles.content} pointerEvents="auto">{children}</View>
                </LinearGradient>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    backdropContainer: {
        backgroundColor: "rgba(0,0,0,0.25)",
    },
    sheetWrapper: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
    },
    sheet: {
        flex: 1,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: "hidden",
        paddingHorizontal: 16,
        paddingTop: 10,
        // Subtle shadow for depth
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOpacity: 0.25,
                shadowRadius: 16,
                shadowOffset: { width: 0, height: -4 },
            },
            android: {
                elevation: 20,
            },
        }),
    },
    handleContainer: {
        width: "100%",
        alignItems: "center",
        paddingVertical: 12,
        marginBottom: 4,
    },
    handle: {
        width: 56,
        height: 6,
        borderRadius: 4,
        backgroundColor: "rgba(255,255,255,0.85)",
    },
    content: {
        flex: 1,
        gap: 12,
    },
});

export default BlurGradientBottomSheet;

BlurGradientBottomSheet.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    children: PropTypes.node,
    height: PropTypes.number,
    blurIntensity: PropTypes.number,
    blurTint: PropTypes.oneOf(["dark", "light", "default"]),
    enableBackdropPress: PropTypes.bool,
    enableFullAreaDrag: PropTypes.bool,
    fullScreen: PropTypes.bool,
    colors: PropTypes.arrayOf(PropTypes.string),
    coverPercentage: PropTypes.number,
};
