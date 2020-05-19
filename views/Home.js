import React from "react";
import List from "../components/List";
import PropTypes from "prop-types";
import SearchBox from "../components/SearchBox";

const Home = props => {
  const { navigation } = props;
  return (
    <>
      <SearchBox navigation={navigation}/>
      <List navigation={navigation} mode={"all"}/>
    </>
  );
};

Home.propTypes = {
  navigation: PropTypes.object
};

export default Home;
