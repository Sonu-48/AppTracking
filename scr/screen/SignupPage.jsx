import React from 'react';
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
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import {Base_Url} from '../apiEndpoint/ApiEndpoint';

const validationSchema = yup.object().shape({
  fullname: yup
    .string()
    .matches(
      /^[A-Za-z\s\-']+$/,
      'Full name can only contain letters, spaces, hyphens, and apostrophes',
    )
    .required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phonenumber: yup
    .string()
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

const SignupPage = ({navigation}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  // handleLogin Function
  const handleSubmit = async (values) => {
    try {
      const res = await axios({
        method: 'post',
        url: Base_Url.register,
        data: {
          full_name: values.fullname,
          email: values.email,
          phone_number: values.phonenumber,
          password: values.password,
        },
      });
      if (res.data.success === true) {
        Alert.alert(res.data.message);
        navigation.navigate('Login');
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Formik
            initialValues={{
              fullname: '',
              email: '',
              phonenumber: '',
              password: '',
            }}
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
                colors={['#71F5FE', '#FFFFFF']}
                style={styles.linearGradient}>
                <View style={styles.formWrapper}>
                  <Text style={styles.h4}>Sign Up</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.text}>Full Name</Text>
                    <TextInput
                      placeholder="Enter name"
                      placeholderTextColor="#000"
                      style={styles.input}
                      value={values.fullname}
                      onChangeText={handleChange('fullname')}
                      onBlur={handleBlur('fullname')}
                    />
                    {touched.fullname && errors.fullname && (
                      <Text style={styles.errortext}>{errors.fullname}</Text>
                    )}
                  </View>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.text}>Email</Text>
                    <TextInput
                      placeholder="Enter email"
                      placeholderTextColor="#000"
                      style={styles.input}
                      value={values.email}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                    />
                    {touched.email && errors.email && (
                      <Text style={styles.errortext}>{errors.email}</Text>
                    )}
                  </View>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.text}>Phone No</Text>
                    <TextInput
                      placeholder="Enter phone number"
                      placeholderTextColor="#000"
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
                  <View style={[styles.inputWrapper]}>
                    <Text style={styles.text}>Password</Text>
                    <View
                      style={[
                        styles.input,
                        {
                          flex: 1,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        },
                      ]}>
                      <TextInput
                        placeholder="Enter password"
                        placeholderTextColor="#000"
                        style={[styles.input, {flex: 1}]}
                        secureTextEntry={!showPassword}
                        value={values.password}
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={{marginRight: 10}}>
                        <Icon
                          name={showPassword ? 'visibility' : 'visibility-off'}
                          size={28}
                          color="#EE14D8"
                        />
                      </TouchableOpacity>
                    </View>
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
                    <Text style={{color: '#000', fontWeight: '600'}}>
                      Already have an accout?{' '}
                    </Text>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Login')}>
                      <Text
                        style={{
                          color: '#EE14D8',
                          fontWeight: '600',
                          fontSize: 16,
                        }}>
                        Login
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
                    <Text style={styles.btntext}>Signup</Text>
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

export default SignupPage;