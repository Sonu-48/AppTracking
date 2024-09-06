import {ScrollView, Text, View} from 'react-native';
import {styles} from '../styles/Styles';

const TipsPage = () => {
  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <View style={styles.container}>
        <View>
          <Text style={styles.h4}>Tip 1</Text>
          <Text style={[styles.text,{fontWeight:'400'}]}>
            <Text style={styles.boldtext}>Know the Odds:</Text>Be aware of the
            odds and house edge for different games.
          </Text>
          <Text style={[styles.text,{fontWeight:'400'}]}>
            <Text style={styles.boldtext}>Gambling Risks:</Text>Recognize the
            risks of gambling and its potential impact on finances and
            well-being.
          </Text>
          <Text style={[styles.text,{fontWeight:'400'}]}>
            <Text style={styles.boldtext}>Self-Limitation:</Text> Utilize any self-limitation or self-exclusion features provided by the app.
          </Text> 
          <Text style={[styles.text,{fontWeight:'400'}]}>
            <Text style={styles.boldtext}>Read Reviews:</Text> Look for reviews and ratings from other users to gauge the app’s reputation.
          </Text> 
          <Text style={[styles.text,{fontWeight:'400'}]}>
            <Text style={styles.boldtext}>Monitor Transactions: </Text> Regularly review your account and transaction history for any unauthorized activities.
          </Text> 
          <Text style={[styles.text,{fontWeight:'400'}]}>
            <Text style={styles.boldtext}>Time Management: </Text> Limit the amount of time you spend on gambling activities.
          </Text>           
        </View>
      </View>
    </ScrollView>
  );
};
export default TipsPage;
