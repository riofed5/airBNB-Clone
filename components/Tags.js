import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Text } from 'native-base';
import PropTypes from 'prop-types';

const Tags = (props) => {
  const tags = ["Helsinki", "Vantaa", "Tampere"];
  return (
    <View style={styles.view}>
      <ScrollView horizontal>
        {tags.map((item, index) => (
          <Button light key={index} style={styles.item} onPress={() => {
            props.navigation.push("SearchPage", {input: item})
          }}>
            <Text style={{
              fontSize: 12,
              color:"black"
            }}>#{item}</Text>
          </Button>
        ))}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 15,
    margin: 2,
    borderWidth: 0.2,
    borderRadius: 30,
    borderColor: "#C4C3C2",
  },

  view: {
    marginHorizontal: 20,
    marginVertical: 10,
  }
});

Tags.propTypes = {
  navigation: PropTypes.object,
};

export default Tags;
