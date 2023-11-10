import { NavigationSceneRendererProps } from "react-navigation";
import { Animated, Easing } from "react-native";

export const transitionConfigForAnimations = () => ({
    transitionSpec: {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
        timing: Animated.timing,
        useNativeDriver: true
    },
    screenInterpolator: (sceneProps: NavigationSceneRendererProps) => {
        const { layout, position, scene } = sceneProps;
        const { index } = scene;

        const height = layout.initHeight;
        const translateY = position.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [height, 0, 0]
        });

        const opacity = position.interpolate({
            inputRange: [index - 1, index - 0.99, index],
            outputRange: [0, 1, 1]
        });

        return { opacity, transform: [{ translateY }] };
    }
});

export const transitionConfigOnlyOpacity = () => ({
    transitionSpec: {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
        timing: Animated.timing
    },
    screenInterpolator: (sceneProps: NavigationSceneRendererProps) => {
        const { position, scene } = sceneProps;
        const { index } = scene;

        const opacity = position.interpolate({
            inputRange: [index - 1, index],
            outputRange: [0, 1]
        });

        return { opacity };
    }
});
