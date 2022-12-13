import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View ,Alert} from 'react-native';
import React,{useEffect} from "react";
import messaging from '@react-native-firebase/messaging';

export default function App() {

  const requestUserPermission = async () =>{
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }
  
  useEffect(() =>{
  if(requestUserPermission()){
    messaging().getToken().then(token =>{
      console.log(token);
    });
  }
  else{
    console.log("failed token status",authStatus);
  }
  
  // Check whether an initial notification is available
  messaging()
  .getInitialNotification()
  .then(async(remoteMessage) => {
    if (remoteMessage) {
      console.log(
        'Notification caused app to open from quit state:',
        remoteMessage.notification,
      );
      }
  });
  
      // Assume a message-notification contains a "type" property in the data payload of the screen to open
  
      messaging().onNotificationOpenedApp(async(remoteMessage) => {
        console.log(
          'Notification caused app to open from background state:',
          remoteMessage.notification,
        );
      });
     // Register background handler
      messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
  });
      const unsubscribe = messaging().onMessage(async remoteMessage => {
       Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  });
  
       return unsubscribe;
  
  
  }, [])
  



  return (
    <View style={styles.container}>
      <Text>Open up App.js to start !</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
