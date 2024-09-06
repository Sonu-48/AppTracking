import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomModule from './CustomModule'; // Adjust the import path as necessary

const App = () => {
  const [userDeviceDetails, setUserDeviceDetails] = useState(null);
  const [customModuleEmitter, setCustomModuleEmitter] = useState(null);

  const sendUserDetails = async (details) => {
    // Implement your logic to send user details
    console.log('Sending user details:', details);
  };

  const checkAndSendUserDetails = async () => {
    // Implement your logic to check and send user details
    console.log('Checking and sending user details');
    if (userDeviceDetails) {
      await sendUserDetails(userDeviceDetails);
    }
  };

  const getLastCheckedDate = async () => {
    try {
      const date = await AsyncStorage.getItem('lastCheckedDate');
      return date ? new Date(date) : null;
    } catch (error) {
      console.error('Error fetching last checked date:', error);
      return null;
    }
  };

  const setLastCheckedDate = async (date) => {
    try {
      await AsyncStorage.setItem('lastCheckedDate', date.toISOString());
    } catch (error) {
      console.error('Error setting last checked date:', error);
    }
  };

  useEffect(() => {
    const handleSimilarAppDetected = async (packageName) => {
      Alert.alert(
        'Similar App Detected',
        `Similar app with package name ${packageName} detected.`,
      );

      // Send user details when similar app is detected
      if (userDeviceDetails) {
        await sendUserDetails(userDeviceDetails);
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

    // Check the date and perform actions if needed
    const checkDateAndPerformAction = async () => {
      const lastCheckedDate = await getLastCheckedDate();
      const now = new Date();
      
      // Perform check if last checked date is not today
      if (!lastCheckedDate || lastCheckedDate.toDateString() !== now.toDateString()) {
        // Update the last checked date
        await setLastCheckedDate(now);
        
        // Perform your check and send user details if necessary
        await checkAndSendUserDetails();
      }
    };

    checkDateAndPerformAction();

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
  }, [customModuleEmitter, userDeviceDetails]);

  return (
    // Your component JSX
    <>
    </>
  );
};

export default App;
