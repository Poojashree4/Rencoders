// import { Dimensions, StyleSheet } from 'react-native';


// const windowWidth = Dimensions.get('window').width;
// const windowHeight = Dimensions.get('window').height;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//     paddingHorizontal: windowWidth * 0.05, 
//   },
//   logo: {
//     resizeMode: 'contain',
//     marginTop:  windowHeight * 0.03,
//     marginBottom: windowHeight * 0.01, 
//     width: windowWidth * 0.7,
//     height: windowHeight * 0.2, 
//   },
//   box: {
//     padding: windowWidth * 0.05, 
//     backgroundColor: ' rgba(255, 255, 255)',
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     alignItems: 'center',
//     width: windowWidth * 0.9, 
//   },
//   inpt: {
//     borderBottomColor: '#ccc',
//     borderBottomWidth: 1,
//     marginLeft: 10,
//     marginRight: 10,
//     width: windowWidth * 0.7, 
//     fontSize: windowWidth * 0.045, 
//     padding: windowWidth * 0.02,
//   },
//   input: {
//     borderBottomColor: '#ccc',
//     borderBottomWidth: 1,
//     marginLeft: 10,
//     marginRight: 10,
//     width: windowWidth * 0.7, 
//     fontSize: windowWidth * 0.045, 
//     padding: windowWidth * 0.02,
//   },
//   button: {
//     backgroundColor: '#0077FF',
//     padding: windowHeight * 0.02, 
//     borderRadius: 5,
//     width: windowWidth * 0.6, 
//     marginTop: windowHeight * 0.05, 
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: windowWidth * 0.05, 
//   },
// });

// export default styles;

import { Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  gradientBackground: {
    height: windowHeight * 0.4, // Adjust this to cover up to your logo
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: windowHeight * 0.05,
  },
  logo: {
    resizeMode: 'contain',
    width: windowWidth * 0.7,
    height: windowHeight * 0.2,
   
  },
  appTitle: {
    color: 'white',
    fontSize: windowWidth * 0.08,
    fontWeight: 'bold',
    marginTop: windowHeight * 0.01,
  },
  appSubtitle: {
    color: 'white',
    fontSize: windowWidth * 0.04,
    textAlign: 'center',
    marginHorizontal: windowWidth * 0.1,
    // marginTop: windowHeight * 0.00,
    marginTop:-30,
    marginBottom:20,
  },
  box: {
    padding: windowWidth * 0.05,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    alignItems: 'center',
    width: windowWidth * 0.9,
    marginTop: -windowHeight * 0.05, // This pulls the box up slightly over the gradient
    zIndex: 1,
    marginLeft:20,
    elevation:5,
  },
  welcomeText: {
    fontSize: windowWidth * 0.06,
    fontWeight: 'bold',
    marginBottom: windowHeight * 0.03,
    alignSelf: 'flex-start',
  },
  inpt: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    width: '100%',
    fontSize: windowWidth * 0.045,
    padding: windowWidth * 0.02,
    marginBottom: windowHeight * 0.03,
  },
  inputContainer: {
    width: '100%',
    marginBottom: windowHeight * 0.02,
  },
  button: {
    backgroundColor: '#0077FF',
    padding: windowHeight * 0.02,
    borderRadius: 30, // More rounded corners
    width: '100%',
    marginTop: windowHeight * 0.05,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: windowWidth * 0.05,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#0077FF',
    fontSize: windowWidth * 0.035,
    alignSelf: 'flex-end',
    marginTop: windowHeight * 0.01,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: windowHeight * 0.03,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  dividerText: {
    marginHorizontal: windowWidth * 0.03,
    color: '#777',
  },
  signUpText: {
    color: '#0077FF',
    fontSize: windowWidth * 0.04,
    fontWeight: 'bold',
  },
  rolebutton: {
    backgroundColor: '#0077FF',
    padding: windowHeight * 0.05,
    borderRadius: 10, // More rounded corners
    width: '100%',
    marginTop: windowHeight * 0.02,
    alignItems: 'center',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: windowHeight * 0.02,
  },
  roleButton: {
    flex: 1,
    padding: windowHeight * 0.03,
    borderRadius: 30,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: 'green',
  },
  unselectedButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  otpSubtitle: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 14,
  },
  resendButton: {
    marginTop: 15,
    alignSelf: 'center',
  },
  resendButtonText: {
    color: '#007AFF',
    fontSize: 14,
  },
});

export default styles;