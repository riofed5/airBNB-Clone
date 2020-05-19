import { useState } from 'react';
import { AsyncStorage } from 'react-native';
import { fetchGET, fetchPOST } from './APIHooks';

const useAddReviewForm = () => {
  const [inputs, setInputs] = useState({comment: ''});

  const handleReviewChange = (text) => {
    setInputs((inputs) =>
      ({
        ...inputs,
        comment: text,
      }));
  };

  const handleAddReview = async (id, setReviewsArray) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const data = {
        file_id: id,
        comment: inputs.comment,
      };
      const resp = await fetchPOST('comments', data, token);
      console.log('comment resp', resp);
      if (resp.comment_id) {
        const reviews = await fetchGET('comments/file', id);
        setReviewsArray(reviews);
        setInputs({comment: ''});
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  return {
    handleReviewChange,
    handleAddReview,
    inputs,
    setInputs,
  };
};

export default useAddReviewForm;
