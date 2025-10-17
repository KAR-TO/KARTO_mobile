import { LinearGradient } from 'expo-linear-gradient';
import PropTypes from 'prop-types';
import { useMemo, useRef } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedRef, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Colors, Fonts } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const Dot = ({ index, progress }) => {
    const style = useAnimatedStyle(() => {
        const w = interpolate(progress.value, [index - 1, index, index + 1], [6, 18, 6], Extrapolation.CLAMP);
        const o = interpolate(progress.value, [index - 1, index, index + 1], [0.4, 1, 0.4], Extrapolation.CLAMP);
        return { width: w, opacity: o };
    });
    return <Animated.View style={[styles.dot, style]} />;
};

Dot.propTypes = {
    index: PropTypes.number.isRequired,
    // progress is a Reanimated shared value with .value number
    progress: PropTypes.shape({ value: PropTypes.number }).isRequired,
};

const Page = ({ title, subtitle, image, colors }) => (
    <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.page}>
        {image ? <Image source={image} style={styles.image} /> : <View style={styles.imagePlaceholder} />}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
    </LinearGradient>
);

Page.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    image: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    colors: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default function Onboarding({ pages, onSkip, onDone, nextLabel = 'Növbəti', skipLabel = 'Keç', doneLabel = 'Başla' }) {
    const pagerRef = useAnimatedRef();
    const jsRef = useRef(null);
    const x = useSharedValue(0);

    const onScroll = useAnimatedScrollHandler({
        onScroll: (e) => {
            x.value = e.contentOffset.x / SCREEN_WIDTH;
        },
    });

    const pageCount = pages?.length ?? 0;
    const currentIndex = useMemo(() => Math.round(x.value), [x]);

    const scrollTo = (index) => {
        if (jsRef.current) {
            jsRef.current.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
        }
    };

    const handleNext = () => {
        const i = Math.round(x.value);
        if (i < pageCount - 1) scrollTo(i + 1);
        else onDone?.();
    };

    return (
        <View style={styles.container}>
            <Animated.ScrollView
                ref={(r) => {
                    jsRef.current = r;
                    // eslint-disable-next-line no-unused-expressions
                    pagerRef.current;
                }}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
                bounces={false}
            >
                {pages.map((p) => {
                    const { key: _pageKey, ...pageProps } = p || {};
                    const k = _pageKey || p?.title;
                    return <Page key={k} {...pageProps} />;
                })}
            </Animated.ScrollView>

            <View style={styles.footer}>
                <Pressable onPress={onSkip} style={[styles.ghostBtn]}>
                    <Text style={styles.ghostText}>{skipLabel}</Text>
                </Pressable>

                <View style={styles.dots}>
                    {pages.map((_, idx) => (
                        <Dot key={`dot-${pages[idx]?.key || pages[idx]?.title || idx}`} index={idx} progress={x} />
                    ))}
                </View>

                <Pressable onPress={handleNext} style={[styles.ctaBtn]}>
                    <Text style={styles.ctaText}>{currentIndex === pageCount - 1 ? doneLabel : nextLabel}</Text>
                </Pressable>
            </View>
        </View>
    );
}

Onboarding.propTypes = {
    pages: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string,
            title: PropTypes.string.isRequired,
            subtitle: PropTypes.string.isRequired,
            image: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
            colors: PropTypes.arrayOf(PropTypes.string).isRequired,
        })
    ).isRequired,
    onSkip: PropTypes.func,
    onDone: PropTypes.func,
    nextLabel: PropTypes.string,
    skipLabel: PropTypes.string,
    doneLabel: PropTypes.string,
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    page: { width: SCREEN_WIDTH, flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
    image: { width: 220, height: 220, resizeMode: 'contain', marginBottom: 24 },
    imagePlaceholder: { width: 220, height: 220, marginBottom: 24, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)' },
    title: { fontFamily: Fonts.Poppins_SemiBold, fontSize: 24, color: '#fff', textAlign: 'center' },
    subtitle: { fontFamily: Fonts.Poppins_Regular, fontSize: 16, color: 'rgba(255,255,255,0.92)', textAlign: 'center', marginTop: 10, lineHeight: 22 },
    footer: { position: 'absolute', bottom: 24, left: 16, right: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    dots: { flexDirection: 'row', gap: 8, alignItems: 'center' },
    dot: { height: 6, borderRadius: 3, backgroundColor: '#fff' },
    ghostBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)' },
    ghostText: { color: '#fff', fontFamily: Fonts.Poppins_Regular, fontSize: 14 },
    ctaBtn: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 14, backgroundColor: Colors.primary },
    ctaText: { color: '#fff', fontFamily: Fonts.Poppins_SemiBold, fontSize: 14 },
});
