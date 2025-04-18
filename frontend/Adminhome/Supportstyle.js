import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(240, 245, 248, 0.93)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: height * 0.02,
  },
  card: {
    flex: 1,
    padding: width * 0.05,
    backgroundColor: 'rgba(125, 172, 244, 0.3)',
    borderRadius: width * 0.05,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  //  elevation: 5,
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 10,
    width: '97%',
    marginBottom: height * 0.07,
    marginTop: -height * 0.04,
   // backgroundColor: 'rgba(151, 106, 156, 0.05)', // subtle transparency
    borderWidth: 1,
    borderColor: 'rgba(43, 41, 41, 0.8)',
  },
  cardtwo: {
    flex: 1,
    padding: width * 0.05,
    backgroundColor: 'rgba(198, 171, 208, 0.9)',
    borderRadius: width * 0.05,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    //elevation: 5,
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 10,
    width: '97%',
    marginBottom: height * 0.07,
    marginTop: -height * 0.04,
    borderWidth: 1,
    borderColor: 'rgba(41, 38, 38, 0.8)',
  },
  cardone: {
    flex: 1,
    padding: width * 0.05,
    backgroundColor: 'rgba(212, 240, 229, 0.93)',
    borderRadius: width * 0.08,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginHorizontal: 20,
    marginBottom: height * 0.06,
    width: '100%',
    height: height * 0.3,
  },
  cardHover: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    transform: [{ scale: 1.05 }],
  },
  cardImage: {
    width: width * 0.25,
    height: width * 0.25,
    marginBottom: height * 0.015,
  },
  cardTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: height * 0.01,
    color: '#333',
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: width * 0.035,
    color: 'gray',
    marginBottom: height * 0.015,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'blue',
    padding: height * 0.015,
    borderRadius: 5,
    width: '70%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: width * 0.04,
  },
  countContainer: {
    marginTop: height * 0.005,
  },
  countText: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: 'white',
  },
  header: {
    height: height * 0.18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: height * 0.04,
    borderBottomLeftRadius: width * 0.1,
    borderBottomRightRadius: width * 0.1,
    marginBottom: height * 0.04,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  headtitl: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    marginBottom: height * 0.03,
    color: 'purple',
    textAlign: 'center',
    marginTop: -height * 0.03,
  },
  welcomeText: {
    fontSize: width * 0.04,
    color: '#555',
    textAlign: 'center',
    paddingHorizontal: width * 0.06,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.015,
    backgroundColor: 'rgb(206 ,234,214)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: height * 0.01,
  },
  cardLogo: {
    width: width * 0.18,
    height: height * 0.08,
  },
  cardBellIcon: {
    marginRight: width * 0.02,
  },
  navbarContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  exploreDetailsHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 10,
    color: '#333', // You can change the color as per your design
  },

  cardcategory: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15, // adds space above and below
    marginLeft: 10,
    color: '#333',
  },
  exploreHeading: {
  fontSize: 22,
  fontWeight: 'bold',
  color: '#333',
  marginTop: 20,
  marginBottom: 10,
  marginLeft: 15,
}

  
});

export default styles;
