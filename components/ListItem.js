import React, { useState } from "react";
import { Button, Icon, Spinner, Text } from "native-base";
import PropTypes from "prop-types";
import { mediaURL } from "../constants/urlConst";
import { AsyncStorage, Dimensions, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { fetchDELETE } from "../hooks/APIHooks";
import RatingView from './RatingView';

const width = Dimensions.get("window").width;
const ListItem = props => {
  const {singleMedia, mode, getMedia, navigation} = props;
  const {title, description, file_id, thumbnails} = singleMedia;


  let info;
  if (description) {
    info = JSON.parse(description);
  }
  const [open, setOpen] = useState(false);

  return (
    <View>
      {!description ? (
        <Spinner/>
      ) : (
        <TouchableOpacity
          style={
            mode === "myfiles" || mode === "search"
              ? styles.columnContainer
              : styles.wrapContainer
          }
          onPress={() => {
            if (open) {
              setOpen(!open);
            }
            navigation.push("Single", {file: singleMedia, mode: mode});
          }}
          onLongPress={() => {
            if (mode === "myfiles") {
              setOpen(!open);
            }
          }}
        >
          {mode === "myfiles" && open && (
            <View
              style={{...styles.buttonContainer, top: 100, width: "100%"}}
            >
              <Button
                full
                style={{backgroundColor:'#50514F'}}
                onPress={() => {
                  setOpen(!open);
                  props.navigation.push("Modify", {file: props.singleMedia});
                }}
              >
                <Icon name="create"/>
                <Text>Modify</Text>
              </Button>
              <Button
                full
                style={{backgroundColor:'#F25F5C'}}
                onPress={async () => {
                  setOpen(!open);
                  const token = await AsyncStorage.getItem("userToken");
                  const del = await fetchDELETE(
                    "media",
                    props.singleMedia.file_id,
                    token
                  );
                  console.log("delete", del);
                  if (del.message) {
                    getMedia(props.mode);
                  }
                }}
              >
                <Icon name="trash"/>
                <Text>Delete</Text>
              </Button>
            </View>
          )}
          <Image
            source={{uri: mediaURL + thumbnails.w320}}
            style={{
              height: mode === "myfiles" || mode === "search" ? 250 : 150,
              width: "100%",
              borderRadius: 5,
              opacity: open ? 0.4 : 1
            }}
          />

          <View
            style={
              mode === "myfiles" || mode === "search"
                ? {flexDirection: "row", justifyContent: "space-between"}
                : {}
            }
          >
            <View style={{marginVertical: 3}}>
              {info.location !== undefined && (
                <Text
                  style={
                    mode === "myfiles" || mode === "search"
                      ? {...styles.title2}
                      : {...styles.title1, color: "#9E6969"}
                  }
                  numberOfLines={1}
                >
                  {info.location}
                </Text>
              )}
              <Text
                style={
                  mode === "myfiles" || mode === "search"
                    ? {...styles.subtitle2}
                    : {...styles.subtitle1}
                }
                numberOfLines={1}
              >
                {title}
              </Text>
              {mode !== "myfiles" && <Text>{info.price} € per night</Text>}
            </View>
            <RatingView fontSize={13} id={file_id}/>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapContainer: {
    width: (width - 40) * 0.48,
    marginVertical: 5
  },
  columnContainer: {
    marginVertical: 15
  },
  title1: {
    fontSize: 12,
    fontWeight: "700",
    paddingVertical: 3,
    textTransform: "capitalize"
  },
  subtitle1: {
    fontSize: 12,
    fontWeight: "700",
    paddingVertical: 3,
    textTransform: "capitalize"
  },
  title2: {
    fontSize: 14,
    paddingVertical: 3,
    color: "#727272",
    textTransform: "capitalize"
  },
  subtitle2: {
    fontSize: 16,
    paddingVertical: 3,
    textTransform: "capitalize"
  },
  bottom: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 3,
    alignContent: "flex-start"
  },
  bottomLeft: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  buttonContainer: {
    position: "absolute",
    zIndex: 4,
    borderWidth: 0.4,
    opacity: 1
  }
});

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
  mode: PropTypes.string,
  getMedia: PropTypes.func
};

export default ListItem;
