import React, { useContext, useEffect, useState } from 'react';
import { Button, Icon, Text, View } from 'native-base';
import PropTypes from 'prop-types';
import AsyncImage from '../components/AsyncImage';
import { AsyncStorage, Dimensions, Modal, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { mediaURL } from '../constants/urlConst';
import { Video } from 'expo-av';
import { fetchDELETE, fetchGET, fetchPOST, getFavoriteMedia } from '../hooks/APIHooks';
import { MediaContext } from "../contexts/MediaContext";
import Reviews from "../components/Reviews";
import UserAvatar from "../components/UserAvatar";
import BookingSection from "../components/BookingSection";
import { AirbnbRating } from 'react-native-ratings';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const Single = (props) => {
  const [media, setMedia] = useContext(MediaContext);
  const [user, setUser] = useState({});
  const [saved, setSaved] = useState(undefined);
  const [defaultVote, setDefaultVote] = useState(1);
  const [vote, setVote] = useState(undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const [change, setChange] = useState(false);

  const [postedByCurrentUser, setPostedByCurrentUser] = useState(true);
  const {navigation} = props;
  const file = navigation.state.params.file;
  const mode = navigation.state.params.mode;

  // get the description object of media file
  const info = JSON.parse(file.description);

  const getUser = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const json = await fetchGET('users', file.user_id, token);
      const userFromStorage = await AsyncStorage.getItem("user");
      const uData = JSON.parse(userFromStorage);
      setUser(json);
      setPostedByCurrentUser(uData.user_id === file.user_id);
    } catch (e) {
      console.log('getUser error', e);
    }
  };

  const checkSaved = async () => {
    try {
      const savedLists = await fetchGET('favourites/file', file.file_id);
      savedLists.filter(item => item.user_id === file.user_id);
      console.log('saved', savedLists);
      if (savedLists.length !== 0) {
        setSaved(true);
      } else {
        setSaved(false);
      }
    } catch (e) {
      console.log('checkSaved error', e);
    }
  };

  const saveOrUnsave = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (!saved) {
      try {
        const json = await fetchPOST('favourites', {file_id: file.file_id}, token);
        console.log('Save', json);
        if (json.favourite_id) {
          setSaved(true);
        }
      } catch (e) {
        console.log('saving error', e);
      }
    } else if (saved) {
      try {
        const json = await fetchDELETE('favourites/file', file.file_id, token);
        console.log('Unsave', json);
        if (json.message.includes('deleted')) {
          setSaved(false);
        }
      } catch (e) {
        console.log('unsaving error', e);
      }
    }
    const favouriteMedia = await getFavoriteMedia(token);
    setMedia((media) => ({
      ...media,
      favouriteMedia: favouriteMedia,
    }))
  };

  useEffect(() => {
    getUser();
    checkSaved();
  }, []);

  return (
    <>
      <ScrollView style={styles.card}>
        <View>
          {file.media_type === 'image' ? (
            <AsyncImage
              style={styles.mainImageOrVideo}
              spinnerColor='#777'
              source={{uri: mediaURL + file.filename}}
            />) :
            (<Video
              source={{uri: mediaURL + file.filename}}
              resizeMode={'cover'}
              useNativeControls
              style={styles.mainImageOrVideo}
              onError={(e) => {
                console.log('video error', e);
              }}
              onLoad={(evt) => {
                console.log('onload', evt);
              }}
            />
            )
          }
          {!postedByCurrentUser && saved !== undefined &&
            <View style={styles.saveArea}>
              <Button rounded light onPress={saveOrUnsave}>
                <Icon style={saved ? styles.savedIcon : styles.defaultSaveIcon} name={'heart'} />
              </Button>
            </View>}
        </View>
        <View style={styles.infoSection}>

          {/* Rating  */}
          {!postedByCurrentUser && mode === "booked" &&
            <AirbnbRating
              count={5}
              reviews={["Terrible", "Bad", "OK", "Good", "Very Good"]}
              defaultRating={defaultVote}
              size={20}
              onFinishRating={(e) => {
                setVote(e);
                setModalVisible(true);
              }}
            />
          }
          {/* End of rating */}
          <View>
            <Text style={styles.titleText}>{file.title}</Text>
          </View>
          <View style={styles.ownerAndBasicInfoSection}>
            <View>
              <Text>{info.location}</Text>
              <Text>Hosted by {user.username}</Text>
            </View>
            <UserAvatar userId={file.user_id} avatarStyle={styles.imageAvatar} iconStyle={styles.imageIcon} />
          </View>
          <Text>Capacity: {info.capacity} person(s)</Text>
          <View style={styles.descriptionArea}>
            <Text style={styles.descriptionTitleText}>About</Text>
            {info.description === '' ? <Text>No descriptions provided.</Text> : <Text>{info.description}</Text>}
          </View>
          <Reviews file={file} postedByCurrentUser={postedByCurrentUser} mode={mode} />
        </View>
      </ScrollView>
      {change &&
        <BookingSection
          defVote={setDefaultVote}
          file={file}
          info={info} navigation={navigation}
          postedByCurrentUser={postedByCurrentUser}
          mode={mode} />
      }
      {!change &&
        <BookingSection
          defVote={setDefaultVote}
          file={file}
          info={info} navigation={navigation}
          postedByCurrentUser={postedByCurrentUser}
          mode={mode} />
      }
      <View style={styles.backArea}>
        <Button transparent onPress={() => navigation.pop()}>
          <Icon style={styles.backIcon} name={'arrow-back'} />
        </Button>
      </View>
      {/* Modal confirm rating */}
      <Modal
        animationType="fade"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={{marginTop: (deviceHeight - 400) / 2, alignItems: 'center', marginHorizontal: 20}}>
          <View>
            <TouchableOpacity
              style={{margin: 20}}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}>
              <Icon name='close' style={{color: 'red', fontSize: 50}}></Icon>
            </TouchableOpacity>
            <Text style={{
              textAlign: "center",
              width: deviceWidth,
              fontSize: 30,
              alignItems: "center",
              marginVertical: 100
            }}>You vote this place {vote} stars</Text>
            <View style={{flexDirection: "row", width: "100%", marginVertical: 20, marginHorizontal: 20}}>
              <Button style={{width: (deviceWidth - 40) / 2, alignContent: "space-around"}} bordered danger
                onPress={() => setModalVisible(!modalVisible)}>
                <Icon name="close" />
                <Text>Cancel</Text>
              </Button>
              <Button style={{width: (deviceWidth - 40) / 2, alignContent: "space-around"}} bordered primary

                onPress={async () => {
                  // Prepare data before post
                  const token = await AsyncStorage.getItem("userToken");
                  console.log("token here", token);
                  const data = {
                    file_id: file.file_id,
                    rating: vote
                  };
                  console.log("prepared data", data);
                  //New ratings is replace the old one;
                  try {
                    const del = await fetchDELETE(
                      "ratings/file",
                      file.file_id,
                      token
                    );
                    console.log("New rating is replaced the old one", del.message);
                  } catch (err) {
                    console.log("First time rating it !");
                  }
                  try {
                    const post = await fetchPOST('ratings', data, token);
                    console.log("completed post", post);
                    setChange(!change);
                    setModalVisible(!modalVisible);
                  } catch (err) {
                    console.log("error when post", err.message);
                  }
                }
                }>
                <Icon name="checkmark" />
                <Text>Agree</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
      {/* End modal confirm rating */}
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 80,
    width: '100%',
    height: '100%',
  },
  mainImageOrVideo: {
    width: '100%',
    height: 2 * deviceHeight / 5,
    resizeMode: 'cover',
  },
  backArea: {
    position: 'absolute',
    top: 30,
    left: 5,
  },
  backIcon: {
    color: 'white',
  },
  saveArea: {
    position: 'absolute',
    top: 30,
    right: 15,
  },
  defaultSaveIcon: {
    color: 'black'
  },
  savedIcon: {
    color: 'red',
  },
  infoSection: {
    width: '100%',
    paddingHorizontal: 15,
  },
  descriptionTitleText: {
    marginBottom: 15,
    fontSize: 25,
  },
  titleText: {
    marginTop: 10,
    fontSize: 30,
    fontWeight: 'bold',
  },
  ownerAndBasicInfoSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 75,
    flexDirection: 'row',
  },
  imageAvatar: {
    width: 70,
    height: 70,
    borderRadius: 500,
  },
  imageIcon: {
    fontSize: 70,
    color: 'black',
  },
  descriptionArea: {
    marginBottom: 20,
  }
});

Single.propTypes = {
  navigation: PropTypes.object,
};

export default Single;
