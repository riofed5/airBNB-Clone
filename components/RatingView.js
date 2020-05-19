import React, { useEffect, useState } from 'react';
import { AsyncStorage, StyleSheet } from 'react-native';
import { Icon, Text, View } from 'native-base';
import { fetchGET } from "../hooks/APIHooks";
import PropTypes from 'prop-types';

const Rating = props => {
  const [rating, setRating] = useState({});
  const id = props.id;

  const getPostRating = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const json = await fetchGET('ratings/file', id, token);

    //Edit info of rating
    const avarageRating= json.map(item => item.rating).reduce((a, b) => a + b, 0) / json.length;
    if(props.mode === "booked"){
      props.defVote(avarageRating);
    }
    const result = {
      ratingAve: isNaN(avarageRating) ? 0 : avarageRating,
      count: json.length,
    };
    setRating(result);
  };

  useEffect(() => {
    getPostRating();

  }, []);

  return (
    <View style={styles.ratingAndPriceInfoSection}>
      <Icon name={'star'} style={{
        ...styles.ratingText,
        fontSize: props.fontSize + 7,
      }} />
      <Text style={{
        ...styles.ratingText,
        fontSize: props.fontSize,
      }}>
        {rating.ratingAve}
      </Text>
      <Text style={{fontSize: props.fontSize}}>
        ({rating.count})
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  ratingAndPriceInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: 'green',
    marginRight: 5,
  },
});

Rating.propTypes = {
  id: PropTypes.number,
  mode: PropTypes.string,
  defVote: PropTypes.func,
  fontSize: PropTypes.number,
};

export default Rating;
