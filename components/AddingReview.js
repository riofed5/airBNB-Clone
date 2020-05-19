import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Icon, Input, Item } from 'native-base';
import useAddReviewForm from "../hooks/ReviewHooks";
import PropTypes from 'prop-types';

const AddingReview = props => {
  const id = props.id;
  const setReviewsArray = props.setReviewsArray;
  const {
    handleReviewChange,
    handleAddReview,
    inputs,
    setInputs,
  } = useAddReviewForm();

  return (
    <>
      <Item style={styles.container}>
        <Input placeholder={'Add a review...'} onChangeText={handleReviewChange} value={inputs.comment}/>
        <Button transparent disabled={inputs.comment.length === 0} onPress={() => handleAddReview(id, setReviewsArray)}>
          <Icon name={'send'}/>
        </Button>
      </Item>
    </>
  )
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sendIcon: {
    color: 'red'
  }
});

AddingReview.propTypes = {
  id: PropTypes.number,
  setReviewsArray: PropTypes.func,
};

export default AddingReview;
