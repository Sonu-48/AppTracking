import {ScrollView, Text, TouchableOpacity, View, Alert} from 'react-native';
import {NativeModules, NativeEventEmitter} from 'react-native';
import {styles} from '../styles/Styles';
import DeviceInfo from 'react-native-device-info';
import {useState, useEffect} from 'react';
import axios from 'axios';
import {Base_Url} from '../apiEndpoint/ApiEndpoint';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const {CustomModule} = NativeModules;
const customModuleEmitter = new NativeEventEmitter(CustomModule);

const Home = () => {
  const navigation = useNavigation();
  const [userDeviceDetails, setUserDeviceDetails] = useState(null);
  const [deviceId, setDeviceId] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [deviceModel, setDeviceModel] = useState('');
  const [deviceOs, setDeviceOs] = useState('');
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [apiVersion, setApiVersion] = useState('');


  const checkAndSendUserDetails = async () => {
    try {
      const result = await CustomModule.checkSimilarApps();
      const similarApps = result.toString().trim();

      if (similarApps) {
        Alert.alert(
          `You have already installed similar app(s): ${similarApps}`,
        );
        if(userDeviceDetails){
          sendUserDetails();
        }
        console.log(`You have already installed similar apps: ${similarApps}`);
      } else {
        Alert.alert('No Similar Apps Detected');
      }

      await getUserInfo();
    } catch (error) {
      console.error(error);
      Alert.alert('Error checking for similar apps');
    }
  };

  const getUserInfo = async () => {
    try {
      const deviceId = await DeviceInfo.getUniqueId();
      const deviceName = await DeviceInfo.getDeviceName();
      const deviceModel = await DeviceInfo.getModel();
      const deviceOs = await DeviceInfo.getSystemName();
      const deviceApiLevel = await DeviceInfo.getSystemVersion();
      console.log('deviceApiLevel', deviceApiLevel);

      setApiVersion(deviceApiLevel);
      setDeviceId(deviceId);
      setDeviceName(deviceName);
      setDeviceModel(deviceModel);
      setDeviceOs(deviceOs);

      const userInfo = {
        deviceId,
        deviceName,
        deviceModel,
        deviceOs,
      };
      setUserDeviceDetails(userInfo);
    } catch (error) {
      console.error('Error getting device information:', error);
    }
  };

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const value = await AsyncStorage.getItem('token');
        const userIdValue = await AsyncStorage.getItem('user_id');
        setUserId(userIdValue);
        if (value !== null) {
          setToken(value);
          console.log('Token:', value);
        }
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };
    fetchToken();
  }, []);

  //Send User Details
  const sendUserDetails = async () => {
    if (!userDeviceDetails || !token) {
      console.warn('User device details or token is missing');
      return;
    }
    try {
      const res = await axios.post(Base_Url.appdetect, {
        deviceId: userDeviceDetails.deviceId,
        deviceModel: userDeviceDetails.deviceModel,
        deviceName: userDeviceDetails.deviceName,
        deviceOs: userDeviceDetails.deviceOs,
        user_id: userId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (res.status === 200) {
        console.log('User details sent successfully:', res.data);
        Alert.alert('Success', 'User details sent successfully');
      } else {
        console.error('Unexpected response status:', res.status);
        Alert.alert('Error', `Unexpected response status: ${res.status}`);
      }
    } catch (error) {
      console.error('Error sending user details:', error.response?.data || error.message);
      Alert.alert('Error', `Failed to send user details: ${error.response?.data?.message || error.message}`);
    }
  };
  
  useEffect(() => {
    const handleSimilarAppDetected = async packageName => {
      Alert.alert(
        'Similar App Detected',
        `Similar app with package name ${packageName} detected.`,
      );

      // Send user details when similar app is detected
      if (userDeviceDetails) {
         sendUserDetails();
      }
    };
    // Add listener
    if (
      customModuleEmitter &&
      typeof customModuleEmitter.addListener === 'function'
    ) {
      customModuleEmitter.addListener(
        'SimilarAppDetected',
        handleSimilarAppDetected,
      );
    } else {
      console.warn('addListener is not available on customModuleEmitter');
    }

    // Call function to check and send user details
    checkAndSendUserDetails();
    // Cleanup function
    return () => {
      if (customModuleEmitter) {
        if (typeof customModuleEmitter.removeListener === 'function') {
          customModuleEmitter.removeListener(
            'SimilarAppDetected',
            handleSimilarAppDetected,
          );
        } else if (typeof customModuleEmitter.off === 'function') {
          customModuleEmitter.off(
            'SimilarAppDetected',
            handleSimilarAppDetected,
          );
        } else if (
          typeof customModuleEmitter.removeEventListener === 'function'
        ) {
          customModuleEmitter.removeEventListener(
            'SimilarAppDetected',
            handleSimilarAppDetected,
          );
        } else {
          console.warn('No valid method found to remove the listener');
        }
      } else {
        console.warn('customModuleEmitter is not defined');
      }
    };
  },[]);

  // Logout function
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      Alert.alert('Logout Successfully');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={[styles.heading, {flex: 2}]}>My Dashboard</Text>
          <TouchableOpacity
            onPress={handleLogout}
            style={{flex: 1, alignItems: 'flex-end'}}>
            <Text style={{fontWeight: '600', fontSize: 20, color: '#EE14D8'}}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1, paddingTop: 40, paddingBottom: 40}}>
          <TouchableOpacity
            style={{flex: 1}}
            onPress={() => navigation.navigate('Credits')}>
            <View style={styles.dashboardbox}>
              <Text style={styles.title}>Credits</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1}}
            onPress={() => navigation.navigate('Tutorials')}>
            <View style={styles.dashboardbox}>
              <Text style={styles.title}>Tutorials and Guides</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{flex: 1}} onPress={()=>navigation.navigate('Tips')}>
            <View style={styles.dashboardbox}>
              <Text style={styles.title}>Tips</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View>
      </View>
    </ScrollView>
  );
};

export default Home;

// http://192.168.1.240/