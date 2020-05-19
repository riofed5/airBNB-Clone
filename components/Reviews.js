import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Spinner, Text, View, } from 'native-base';
import { fetchGET } from "../hooks/APIHooks";
import ReviewItem from "./ReviewItem";
import AddingReview from "./AddingReview";
import PropTypes from 'prop-types';

const Reviews = props => {
  const [loading, setLoading] = useState(true);
  const [reviewsArray, setReviewsArray] = useState(undefined);
  const file = props.file;
  const mode = props.mode;
  console.log(file);

  const getReview = async () => {
    const json = await fetchGET('comments/file', file.file_id);
    console.log("Get review",json);
    setReviewsArray(json);
    setLoading(false);
  };

  useEffect(() => {
    getReview();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Reviews</Text>
      {loading ?
        <Spinner/> :
        (reviewsArray && reviewsArray.length !== 0) ?
          (reviewsArray.map((item, index) => (
            <ReviewItem
              key={index}
              item={item}/>
          ))) :
          <Text style={styles.noReviewText}>No reviews yet. Be the first to review it!</Text>}
      {mode !== 'booked' ? <></> : <AddingReview id={file.file_id} setReviewsArray={setReviewsArray}/>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  noReviewText: {
    marginBottom: 15,
  },
  titleText: {
    marginBottom: 15,
    fontSize: 25
  }
});

Reviews.propTypes = {
  file: PropTypes.object,
  mode: PropTypes.string,
};

export default Reviews;
