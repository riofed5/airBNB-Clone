import React from 'react';
import { Icon, Text, View } from 'native-base';
import { Dimensions, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const BookedSuccess = props => {
  const {navigation} = props;

  setTimeout(() => {
    navigation.push('Home');
  }, 2000);
  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>Success!</Text>
      <View style={styles.iconContainer}>
        <Icon name={'checkmark'} style={styles.successIcon}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    color: 'green',
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  iconContainer: {
    width: 3 * deviceWidth / 5,
    height: 3 * deviceWidth / 5,
    borderWidth: 6,
    borderColor: 'green',
    borderRadius: 700,
    padding: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIcon: {
    color: 'green',
    fontSize: deviceWidth / 4,
  },
});

BookedSuccess.propTypes = {
  navigation: PropTypes.object,
};

export default BookedSuccess;
