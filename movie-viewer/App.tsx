import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider } from './src/Providers/auth';
import { LoadingProvider } from './src/Providers/loading';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import Root from './src';
import { CacheProvider } from './src/Providers/cache';



const App = () =>
  <SafeAreaProvider>
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <CacheProvider>
          <LoadingProvider>
            <AuthProvider>
              <AutocompleteDropdownContextProvider>
                <Root />
              </AutocompleteDropdownContextProvider>
            </AuthProvider>
          </LoadingProvider>
        </CacheProvider>
      </SafeAreaView>
    </NavigationContainer>
  </SafeAreaProvider>;

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
    position: 'relative',
  },
});
