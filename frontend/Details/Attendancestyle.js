import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

const wp = (percentage) => (width * percentage) / 100;
const hp = (percentage) => (height * percentage) / 100;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: wp(4),
    backgroundColor: '#3F51B5',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: wp(6.5),
    fontWeight: 'bold',
    color: 'white',
    marginBottom: hp(0.5),
  },
  headerSubtitle: {
    fontSize: wp(4),
    color: 'white',
    marginBottom: hp(1.5),
  },
  submitButton: {
    backgroundColor: '#FFC107',
    paddingVertical: hp(1),
    paddingHorizontal: wp(6),
    borderRadius: wp(5),
  },
  submitButtonText: {
    fontSize: wp(4),
    fontWeight: 'bold',
    color: '#333',
  },
  dateText: {
    fontSize: wp(4),
    color: '#333',
    textAlign: 'center',
    paddingVertical: hp(1.5),
    backgroundColor: '#E8EAF6',
  },
  sectionHeader: {
    padding: wp(4),
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  sectionTitle: {
    fontSize: wp(4.5),
    fontWeight: 'bold',
    color: '#333',
  },
  listContent: {
    paddingBottom: hp(10),
  },
  card: {
    backgroundColor: 'white',
    borderRadius: wp(2),
    margin: wp(2),
    padding: wp(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1.5),
  },
  studentName: {
    fontSize: wp(4.5),
    fontWeight: 'bold',
    color: '#333',
  },
  studentDetail: {
    fontSize: wp(3.5),
    color: '#666',
  },
  weekStatus: {
    alignItems: 'center',
  },
  weekDays: {
    fontSize: wp(3),
    color: '#666',
  },
  weekPercentage: {
    fontSize: wp(4),
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  courseContainer: {
    marginTop: hp(1.5),
    paddingTop: hp(1.5),
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  courseTitle: {
    fontSize: wp(4),
    fontWeight: '600',
    color: '#333',
    marginBottom: hp(1),
  },
  courseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1.5),
  },
  courseDetail: {
    fontSize: wp(3.5),
    color: '#666',
  },
  attendanceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: hp(1.5),
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: wp(6),
    fontWeight: 'bold',
    color: '#3F51B5',
  },
  statLabel: {
    fontSize: wp(3),
    color: '#666',
  },
  progressText: {
    fontSize: wp(4),
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(1.5),
  },
  actionButton: {
    backgroundColor: '#E8EAF6',
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    borderRadius: wp(4),
  },
  actionButtonText: {
    color: '#3F51B5',
    fontSize: wp(3.5),
    fontWeight: '500',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingVertical: hp(1.5),
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  navButton: {
    alignItems: 'center',
  },
  navButtonText: {
    color: '#3F51B5',
    fontSize: wp(3),
  },
});

export default styles;
