import React from 'react'
import { ScrollView } from 'react-native'
import List from '../components/List';
import PropTypes from 'prop-types';

const SearchPage = (props) => {
  const {navigation} = props;
  const keySearch = props.navigation.state.params.input;
  return (
    <ScrollView>
      <List navigation={navigation} keySearch={keySearch} mode={"search"}/>
    </ScrollView>
  )
};

SearchPage.propTypes = {
  navigation: PropTypes.object,
};

export default SearchPage
