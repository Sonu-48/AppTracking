import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  safeArea:{
    flex:1
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingLeft: 15,
    paddingRight: 15,
  },
  btn: {
    backgroundColor: '#EE14D8',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 10,
    width: '100%',
    marginTop: 30,
  },
  btntext: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  linearGradient: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 40,
    paddingBottom: 40,
    borderRadius: 10,
  },
  h4: {
    fontSize: 30,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#D9D9D9',
    borderRadius: 4,
    fontSize: 18,
    paddingLeft: 10,
  },
  text: {
    fontSize: 18,
    color: '#000',
    fontWeight: '500',
    marginBottom: 10,
  },
  inputWrapper: {
    marginTop: 20,
  },
  errortext: {
    color: 'red',
    fontSize: 15,
  },
  heading: {
    fontSize: 30,
    fontWeight: '600',
    color: '#000',
  },
  dashboardbox: {
    borderRadius: 10,
    padding: 20,
    flex: 1,
    marginBottom:20,
    alignItems:'center',
    justifyContent:'center'
  },
  title:{
    fontSize:22,
    fontWeight:'600',
    color:'#000',
  },
  boldtext:{
    fontWeight:'600',
  }
});
