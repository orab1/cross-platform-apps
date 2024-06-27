import { SafeAreaView, View } from "react-native"
import Pages from "./Pages"
import { Appbar, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Root = () => {
    const { colors: { background } } = useTheme();
    const { bottom, left, right } = useSafeAreaInsets()

    return (
        <SafeAreaView style={{
            backgroundColor: background,
            paddingLeft: left,
            paddingRight: right,
            paddingTop: 0,
            paddingBottom: bottom,
            display: 'flex',
            flex: 1
        }}>
            <Appbar.Header
                mode='center-aligned' elevated={true}>
                <Appbar.Content title="Movie Viewer" />
            </Appbar.Header>
            <View
                style={{
                    display: 'flex',
                    flex: 1
                }}
            >
                <Pages />
            </View>
        </SafeAreaView >
    )
}

export default Root
