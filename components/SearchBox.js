import React, { useState } from "react";
import { Button, Icon, Text } from "native-base";
import { Dimensions, StyleSheet, TextInput, View } from "react-native";
import PropTypes from 'prop-types';

const deviceHeight = Dimensions.get("window").height;

const SearchBox = props => {
  const placeholder = `Try "Helsinki" `;
  const [input, setInput] = useState("");
  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <View style={styles.icon}>
          <Icon active name="ios-search"/>
        </View>
        <View style={styles.itemRight}>
          <TextInput
            style={styles.textInput}
            placeholder={placeholder}
            onChangeText={e => {
              setInput(e);
            }}
            value={input}
          />
          <Button transparent
                  disabled={input === ""}
                  onPress={() => {
                    props.navigation.push("SearchPage", {input: input});
                    setInput("")
                  }}
          >
            <Text style={{color: input === '' ? "grey" : "#38A5E7"}}>Search</Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignContent: "center",
    marginTop: 10
  },
  item: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginVertical: 10,
    shadowOffset: {width: 0, height: 0},
    shadowColor: "black",
    shadowOpacity: 0.5,
    height: deviceHeight / 20,
    flexDirection: "row",
    borderWidth: 0.2,
    borderRadius: 10,
    borderColor: "grey",
    alignContent: "center",
    alignItems: "center",
    zIndex: 3
  },
  itemRight: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "88%",
    marginHorizontal: 2,
  },
  icon: {
    paddingHorizontal: 10,
    width: "12%",
  },
  textInput: {
    width: "60%"
  }
});

SearchBox.propTypes = {
  navigation: PropTypes.object,
};

export default SearchBox;
