import React, {useState, useEffect} from 'react';
import {ScrollView, Text, TouchableOpacity, View, Alert,AppState} from 'react-native';
import {NativeModules} from 'react-native';
import {styles} from '../styles/Styles';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import {Base_Url} from '../apiEndpoint/ApiEndpoint';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import Fuse from 'fuse.js';

const {InstalledAppsModule} = NativeModules;

const Home = () => {
  const navigation = useNavigation();
  const [userDeviceDetails, setUserDeviceDetails] = useState(null);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [installedApps, setInstalledApps] = useState([]);
  const [similarApps, setSimilarApps] = useState([]);
  const [appsChecked, setAppsChecked] = useState(false);
  const [lastCloseDate, setLastCloseDate] = useState(null);

  // Function to handle app state changes
  const handleAppStateChange = nextAppState => {
    if (nextAppState.match(/inactive|background/)) {
      const currentDate = new Date().toISOString();
      AsyncStorage.setItem('lastCloseDate', currentDate)
        .then(() => {
          console.log('Last close date saved:', currentDate);
          setLastCloseDate(currentDate);
        })
        .catch(error => console.error('Error saving last close date:', error));
    }
  };

  useEffect(() => {
    // Add event listener for app state changes
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  },[]);

  // Fetch installed apps
  const fetchInstalledApps = async () => {
    try {
      const apps = await InstalledAppsModule.getInstalledApps();
      console.log('Installed apps:', apps);
      setInstalledApps(apps);
    } catch (error) {
      console.error('Error fetching installed apps:', error);
    }
  };

  // Get app names from API
  const getAppNames = async () => {
    if (!token) {
      console.error('Token is missing');
      return;
    }

    try {
      const res = await axios.get(Base_Url.appnames, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        const packageNames = res.data.data.map(item =>
          item.app_name.toLowerCase(),
        );
        console.log('AppNames from API response:', packageNames);

        const fuseOptions = {
          includeScore: true,
          threshold: 0.3,
        };
        const fuse = new Fuse(packageNames, fuseOptions);

        // Match installed apps
        const matchedApps = installedApps.filter(
          installedApp => fuse.search(installedApp.toLowerCase()).length > 0,
        );

        console.log('Matched Apps:', matchedApps);
        if (matchedApps.length > 0) {
          setSimilarApps(matchedApps);
          return matchedApps;
        }
      } else {
        console.error('API response indicates failure:', res.data);
      }
    } catch (error) {
      console.error(
        'Error fetching app names:',
        error.response?.data || error.message,
      );
    }
    return [];
  };

  useEffect(() => {
    const fetchTokenAndUserId = async () => {
      try {
        const tokenValue = await AsyncStorage.getItem('token');
        const userIdValue = await AsyncStorage.getItem('user_id');

        if (tokenValue) {
          setToken(tokenValue);
          setUserId(userIdValue);
        }
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };
    fetchTokenAndUserId();
  },[]);

  // Get user device info
  useEffect(() => { 
  const getUserInfo = async () => {
    try {
      const deviceId = await DeviceInfo.getUniqueId();
      const deviceName = await DeviceInfo.getDeviceName();
      const deviceModel = await DeviceInfo.getModel();
      const deviceOs = await DeviceInfo.getSystemName();
      const deviceApiLevel = await DeviceInfo.getSystemVersion();
      console.log('deviceApiLevel', deviceApiLevel);

      const userInfo = {
        deviceId,
        deviceName,
        deviceModel,
        deviceOs,
      };
      setUserDeviceDetails(userInfo);

      // Fetch last close date from AsyncStorage
      const lastCloseDate = await AsyncStorage.getItem('lastCloseDate');
      setLastCloseDate(lastCloseDate);
    } catch (error) {
      console.error('Error getting device information:', error);
    }
  };
    getUserInfo();
  },[]);

  // Check for similar apps only once
  useEffect(() => {
    const checkApps = async () => {
      if (appsChecked) return; // Prevent re-checking

      await fetchInstalledApps();
      const matchedApps = await getAppNames();

      // Only alert and send details if similar apps were found
      if (matchedApps.length > 0) {
        const similarAppNames = matchedApps.join(', ');
        console.log('Similar App Names:', similarAppNames);
        Alert.alert(
          `You have already installed similar app(s): ${similarAppNames}`,
        );
        // Call sendUserDetails after 2 seconds
        setTimeout(() => {
          sendUserDetails();
        }, 2000);
      } else {
        Alert.alert('No Similar Apps Found');
        console.log('No similar apps found.');
      }

      setAppsChecked(true);
    };
    checkApps();
  }, [token]);

  // Send user details
  const sendUserDetails = async () => {
    // if (!userDeviceDetails || !token) {
    //   console.warn('User device details or token is missing');
    //   return;
    // }

    try {
      const res = await axios.post(
        Base_Url.appdetect,
        {
          deviceId: userDeviceDetails.deviceId,
          deviceModel: userDeviceDetails.deviceModel,
          deviceName: userDeviceDetails.deviceName,
          deviceOs: userDeviceDetails.deviceOs,
          user_id: userId,
          app_closedate: lastCloseDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (res.status === 200) {
        Alert.alert('Success', 'User details sent successfully');
        console.log('Success', 'User details sent successfully');
      }
    } catch (error) {
      console.error('Error sending user details:', error.message);
      Alert.alert('Error', `Failed to send user details: ${error.message}`);
    }
  };

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
            <Text style={{fontWeight: '600', fontSize: 20, color: '#FFFFFF'}}>
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
          <TouchableOpacity
            style={{flex: 1}}
            onPress={() => navigation.navigate('Tips')}>
            <View style={styles.dashboardbox}>
              <Text style={styles.title}>Tips</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;
