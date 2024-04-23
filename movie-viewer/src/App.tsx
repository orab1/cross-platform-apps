import { NavigationContainer } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native';
import Pages from './Pages';
import Feed from './Pages/Feed';
import { SafeAreaView } from 'react-native-safe-area-context';

const App = () => {
  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <Pages />
      </SafeAreaView>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
  },
});
