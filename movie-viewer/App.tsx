import { NavigationContainer } from '@react-navigation/native';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider } from './src/Providers/auth';
import Pages from './src/Pages';
import { Appbar } from 'react-native-paper';
import { LoadingProvider } from './src/Providers/loading';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import Root from './src';



const App = () =>
  <SafeAreaProvider>
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <LoadingProvider>
          <AuthProvider>
            <AutocompleteDropdownContextProvider>
              
              <Root />
            </AutocompleteDropdownContextProvider>
          </AuthProvider>
        </LoadingProvider>
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
