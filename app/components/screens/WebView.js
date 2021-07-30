import * as React from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, View, ActivityIndicator, Dimensions } from 'react-native';
//import Loading from './Loading'


const WebViewComponent = ({ route }) => {
    const Loading = () => {
        const all_width = Dimensions.get('window').width;
        const all_height = Dimensions.get('window').height;
        return (

            <ActivityIndicator style={styles.loading}
                size="large"
                color="#bc2b78"
                style={{width:all_width,height:all_height,justifyContent: 'center',alignItems: 'center',}}>
            </ActivityIndicator>

        );
    }
    const url = route.params.url;

    return (

        <WebView
            style={styles.container}
            originWhitelist={['*']}
            source={{ uri: url }}
            startInLoadingState={true}
            renderLoading={() => <Loading />}
        />
    );
}

export default WebViewComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});