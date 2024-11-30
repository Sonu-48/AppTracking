import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {styles} from '../styles/Styles';
import {ScrollView} from 'react-native-gesture-handler';
import {Formik} from 'formik';
import * as yup from 'yup';
import { Base_Url } from '../apiEndpoint/ApiEndpoint';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const validationSchema = yup.object().shape({
  phonenumber: yup
    .string()
    .length(10, 'Phone number must be exactly 10 digits')
    .matches(
      /^(?:\+?\d{1,3})?[-.\s]?(\(?\d{1,4}\)?[-.\s]?)?[\d\s.-]{5,15}\d$/,
      'Invalid phone number',
    )
    .required('Phone number is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const LoginPage = ({navigation}) => {
  const [loading,setLoading] = useState(false);

 //Login Api
 const handleSubmit = async values => {
  setLoading(true);
  try {
    const res = await axios({
      method: 'post',
      url: Base_Url.login,
      data: {
        phone_number: values.phonenumber,
        password: values.password,
      },
    });
    if (res.data.success === true) {
      setLoading(false);
      const key = res.data.data.token;
      await AsyncStorage.setItem('token', key);
      Alert.alert(res.data.message);
      navigation.navigate('Home');
    } else {
      Alert.alert('Invalid credentials');
      setLoading(false)
    }
  } catch (error) {
    setLoading(false);
    Alert.alert('Invalid credentials');
    console.log(error);
  }
};

// get token from AsyncStorage
const [token, setToken] = useState(null);
useEffect(() => {
  AsyncStorage.getItem('token').then(value => {
    if (value !== null) {
      setToken(value);
      console.log('token', value);
    }
  });
},[]);
if (token) {
  navigation.navigate('Home');
}
  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Formik
            initialValues={{phonenumber: '', password: ''}}
            validationSchema={validationSchema}
            onSubmit={values => handleSubmit(values)}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <LinearGradient
                colors={['#BAA769', '#BAA769']}
                style={styles.linearGradient}>
                <View style={styles.formWrapper}>
                  <Text style={styles.h4}>Sign In</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.text}>Phone No</Text>
                    <TextInput
                      placeholder="Enter phone number"
                      placeholderTextColor="#000000"
                      keyboardType="phone-pad"
                      style={styles.input}
                      value={values.phonenumber}
                      onChangeText={handleChange('phonenumber')}
                      onBlur={handleBlur('phonenumber')}
                    />
                    {touched.phonenumber && errors.phonenumber && (
                      <Text style={styles.errortext}>{errors.phonenumber}</Text>
                    )}
                  </View>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.text}>Password</Text>
                    <TextInput
                      placeholder="Enter password"
                      placeholderTextColor="#000000"
                      style={styles.input}
                      secureTextEntry
                      value={values.password}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                    />
                    {touched.password && errors.password && (
                      <Text style={styles.errortext}>{errors.password}</Text>
                    )}
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      paddingTop: 10,
                    }}>
                   <Text style={{color:'#000',fontWeight:'600',fontSize:16}}>Don't have an account? </Text>
                    <View
                      style={{
                        width: 60,
                        height: 60,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('Signup')}
                        style={{
                          width: '100%',
                          height: '100%',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            color: '#FFFFFF',
                            fontWeight: '700',
                            fontSize: 17,
                          }}>
                          Singup
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <TouchableOpacity  style={[styles.btn, loading && { backgroundColor: '#b0bec5' }]}  onPress={handleSubmit} disabled={loading}>
                    <Text style={styles.btntext}>{loading? 'Loading...':'Login'}</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginPage;
