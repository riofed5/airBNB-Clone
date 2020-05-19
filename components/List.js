/* eslint-disable max-len */
import React, { useContext, useEffect, useState } from "react";
import { Spinner } from "native-base";
import ListItem from "./ListItem";
import { MediaContext } from "../contexts/MediaContext";
import { getAllMedia, getBookingMedia, getFavoriteMedia, getUserMedia } from "../hooks/APIHooks";
import PropTypes from "prop-types";
import { AsyncStorage, StyleSheet, View, } from "react-native";
import ImageCover from "./ImageCover";
import { ScrollView } from "react-native-gesture-handler";
import Tags from "../components/Tags";
import Title from "./Title";
import Sort from './Sort';

const List = props => {
  const [media, setMedia] = useContext(MediaContext);
  const [loading, setLoading] = useState(true);

  // Check if an image is user's avatar
  const checkAvatar = async (file) => {
    return file.filter(item => item.description !== "");
  };

  const [option, setOption] = useState(undefined);
  const [fullname, setFullname] = useState(null);

  //Get keySearch from Search page
  const keySearch = props.keySearch;

  const handleOption = (list, option) => {
    if (list.length > 1) {
      switch (option) {
        case "Alphabetical Order":
          return list.sort((a, b) => a.title.localeCompare(b.title));
        case "Price Ascending":
          return list.sort((a, b) => JSON.parse(a.description).price - JSON.parse(b.description).price);
        case "Price Decending":
          return list.sort((a, b) => JSON.parse(b.description).price - JSON.parse(a.description).price);
        default:
          return list;
      }
    } else {
      return list;
    }
  };

  const getMedia = async mode => {
    try {
      console.log("mode", mode);
      //Get userID, userName
      const userFromStorage = await AsyncStorage.getItem("user");
      const userID = JSON.parse(userFromStorage).user_id;
      console.log("my ID", userID);
      const fullname = JSON.parse(userFromStorage).fullname ? `, ${JSON.parse(userFromStorage).fullname}!` : '!';
      setFullname(fullname);
      //Get all Data, myData, bookingData, and favorite Data
      const allData = await getAllMedia();
      const token = await AsyncStorage.getItem("userToken");
      let preMyData = await getUserMedia();
      preMyData= preMyData.filter(item=> item.user_id === userID);
      // Check an image is user's avatar, if true not get it to myData, if false get it.
      const myData = await checkAvatar(preMyData);
      const favouriteMedia = await getFavoriteMedia(token);
      console.log('favouriteList', favouriteMedia)
      const preBookingMedia = await getBookingMedia(userID);

      const bookingMedia= Array.from(new Set(preBookingMedia.map(item=> item.title))).map(title=>{
        return {
          ...preBookingMedia.find(item=> item.title= title)
        }
      });

      setMedia({
        allFiles: allData.reverse(),
        myFiles: myData,
        favouriteMedia: favouriteMedia,
        booked: bookingMedia
      });
      setLoading(false);
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    getMedia(props.mode);
  }, []);

  let searchList;
  if (props.mode === "search") {
    searchList = media.allFiles.filter(item => (JSON.parse(item.description).location.toUpperCase() === keySearch.toUpperCase() || item.title.toUpperCase() === keySearch.toUpperCase()));
  }

  return (
    <View>
      {loading ? (
        <Spinner />
      ) : (
          <>
            {props.mode === "all" && (
              <ScrollView>
                <Tags navigation={props.navigation} />
                <ImageCover />
                <Title title={`Welcome to CloudHome ${fullname}`} subtitle={"A selection of places to stay verified for quality and design."} />
                <View style={styles.wrapContainer}>
                  {media.allFiles.map((item, index) => (
                    <ListItem
                      key={index}
                      navigation={props.navigation}
                      singleMedia={item}
                      mode={props.mode}
                      getMedia={getMedia}
                    />
                  ))}
                </View>
              </ScrollView>
            )}

            {props.mode === "myfiles" && (

              <ScrollView >
                <Title title={"List of your appartments "} />
                {media.myFiles.length > 1 && <Sort setOption={setOption} />}
                <View style={styles.columnContainer}>
                  {handleOption(media.myFiles, option).map((item, index) => (
                    <ListItem
                      key={index}
                      navigation={props.navigation}
                      singleMedia={item}
                      mode={props.mode}
                      getMedia={getMedia}
                    />
                  ))}
                </View>
              </ScrollView>
            )}
            {props.mode === 'saved' &&
              <ScrollView>
                <Title title={"List of saved appartments: "} subtitle={media.favouriteMedia.length > 0 ? null : "There nothing match your search!"} count={media.favouriteMedia.length > 0 ? media.favouriteMedia.length : null} />
                {media.favouriteMedia.length > 1 && <Sort setOption={setOption} />}
                <View style={styles.wrapContainer}>
                  {handleOption(media.favouriteMedia, option).map((item, index) => (
                    <ListItem
                      key={index}
                      navigation={props.navigation}
                      singleMedia={item}
                      mode={props.mode}
                      getMedia={getMedia}
                    />
                  ))}
                </View>
              </ScrollView>
            }
            {props.mode === "search" && (
              <ScrollView>
                <Title title={`Top search relate to "${keySearch}" :`} subtitle={searchList.length > 0 ? null : "There nothing match your search!"} count={searchList.length > 0 ? searchList.length : null} />
                {searchList.length > 1 && <Sort setOption={setOption} />}
                <View style={styles.columnContainer}>
                  {handleOption(searchList, option).map((item, index) => (
                    <ListItem
                      key={index}
                      navigation={props.navigation}
                      singleMedia={item}
                      mode={props.mode}
                      getMedia={getMedia}
                    />
                  ))}
                </View>
              </ScrollView>
            )}
            {props.mode === "booked" && (
              <ScrollView>
                <Title title={"List of your booking: "} subtitle={media.booked.length > 0 ? null : "There is nothing booked."} count={media.booked.length > 0 ? media.booked.length : null} />
                {media.booked.length > 1 && <Sort setOption={setOption} />}
                <View style={styles.wrapContainer}>

                  {handleOption(media.booked, option).map((item, index) => (

                    <ListItem
                      key={index}
                      navigation={props.navigation}
                      singleMedia={item}
                      mode={props.mode}
                      getMedia={getMedia}
                    />
                  ))}
                </View>
              </ScrollView>
            )}
          </>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 75,
    justifyContent: "space-between",

  },
  columnContainer: {
    marginHorizontal: 20,
    marginBottom: 75,
  }
});

List.propTypes = {
  navigation: PropTypes.object,
  mode: PropTypes.string,
  keySearch: PropTypes.string,
};

export default List;
