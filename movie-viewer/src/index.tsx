import { SafeAreaView, View } from "react-native"
import Pages from "./Pages"
import { useLoading } from "./Providers/loading";
import { Appbar, ProgressBar, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Root = () => {
    const { isLoading } = useLoading();
    const { colors: { background } } = useTheme();
    const { top, bottom, left, right } = useSafeAreaInsets()

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
            {isLoading &&
                <View>
                    <ProgressBar indeterminate={true} style={{ backgroundColor: background }} />
                </View>
            }
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
