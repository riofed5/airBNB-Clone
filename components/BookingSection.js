import React from "react";
import { Button, Left, Right, Text, View } from "native-base";
import { StyleSheet } from 'react-native';
import RatingView from './RatingView';
import PropTypes from 'prop-types';

const BookingSection = props => {
  return (
    <View style={styles.bottomBookingSection}>
      <Left>
        <View>
          <Text>
            {props.info.price}€ per night
          </Text>
        </View>
        <RatingView
          mode={props.mode}
          defVote={props.defVote}
          fontSize={17} id={props.file.file_id}/>
      </Left>
      {!props.postedByCurrentUser && props.mode !== 'booked' && (
        <Right>
          <Button danger full style={styles.chooseButton} onPress={() => {
            props.navigation.push("BookingInfo", {file: props.file, info: props.info});
          }}>
            <Text>Book</Text>
          </Button>
        </Right>
      )}
    </View>);
};

const styles = StyleSheet.create({
  bottomBookingSection: {
    position: 'absolute',
    bottom: 0,
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    height: 80,
    padding: 20,
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  ratingAndPriceInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: 'green',
    marginRight: 5
  },
  chooseButton: {
    borderRadius: 5,
  }
});

BookingSection.propTypes = {
  info: PropTypes.object,
  mode: PropTypes.string,
  file: PropTypes.object,
  postedByCurrentUser: PropTypes.bool,
  navigation: PropTypes.object,
  defVote: PropTypes.func,
};

export default BookingSection;
