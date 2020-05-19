import React from "react";
import { StyleSheet, Text, View } from "react-native";
import PropTypes from 'prop-types';

const Title = (props) => {
  console.log(props.count);
  return (
    <View style={styles.container}>
      {/* Title */}
      {props.title &&
        <Text style={styles.title}>{props.title}</Text>
      }
      {/* End title */}

      {/* Subtitle */}
      {props.subtitle &&
      <Text style={styles.subtitle}>
        {props.subtitle}
      </Text>
      }
      {/* End subtitle */}

      {/* This only for search page */}
      {props.count &&
      <Text style={styles.count}>
        {props.count} place(s) to stay
      </Text>
      }

      {/* Ending  */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 10
  },
  title: {
    fontSize: 25,
    fontWeight: "700"
  },
  subtitle: {
    marginVertical: 5
  },
  count: {
    marginVertical: 5,
    fontSize: 18,
    fontWeight: "600",
    paddingTop: 5
  }
});

Title.propTypes = {
  count: PropTypes.number,
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

export default Title;
