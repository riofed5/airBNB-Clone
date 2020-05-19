import React from 'react';
import List from '../components/List';
import PropTypes from 'prop-types';

const Booked = (props) => {
  const {navigation} = props;
  return (
    <List navigation={navigation} mode={'booked'}></List>
  );
};

Booked.propTypes = {
  navigation: PropTypes.object,
};

export default Booked;