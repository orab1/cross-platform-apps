import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../Providers/auth';

const Feed: React.FC = () => {
    const { user } = useAuth();
    return (
        <View >
            <Text>{`${JSON.stringify(user)}`}</Text>
            <StatusBar style="auto" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 0,
        backgroundColor: '#fff',
        flexDirection: 'column',
    },
});

export default Feed;