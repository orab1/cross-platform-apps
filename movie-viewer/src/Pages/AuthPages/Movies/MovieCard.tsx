import React from 'react';
import { Card,  Text, IconButton, withTheme } from 'react-native-paper';
import { MovieDTO } from '../../../Services/Movies';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const MovieCard: React.FC<{ movie: MovieDTO, theme: any }> = ({ movie, theme }) => {
    const { title, overview, backdrop_path, } = movie;
    const navigation = useNavigation();

    return (
        <Card style={styles.card} >
            <Card.Title title={title} />
            <Card.Cover borderRadius={0} source={{ uri: `https://image.tmdb.org/t/p/w500/${backdrop_path}` }} />
            <Card.Content>
                <View>
                    <Text variant='bodyMedium'>{overview}</Text>
                </View>
            </Card.Content>
            <Card.Actions>
                <IconButton
                    icon={'comment-plus'}
                    size={20}
                    mode="contained"
                    iconColor={theme.colors.secondary}
                    onPress={() => {
                        navigation.navigate('AddNewReview', { review: { movie }, isEdit: false })
                    }}
                />
            </Card.Actions>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '100%',
        marginVertical: 10,
        minWidth: '85%',
        maxWidth: '85%',
        minHeight: 200,
        justifyContent: 'center',
    },
    acticityIndicator: {
        flex: 1,
    }
});

export default withTheme(MovieCard);