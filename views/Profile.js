import React, { useEffect, useState } from 'react';
import { Body, Button, CardItem, Container, Content, Icon, Text, View } from 'native-base';
import { AsyncStorage, Dimensions, Image, Modal, StyleSheet ,Platform} from 'react-native';
import PropTypes from 'prop-types';
import { fetchGET } from '../hooks/APIHooks';
import { mediaURL } from '../constants/urlConst';
import List from '../components/List';
import { TouchableOpacity } from 'react-native-gesture-handler';

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const Profile = (props) => {
  const {navigation} = props;
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState({
    userdata: {},
    avatar: "https://",
  });

  const userToState = async () => {
    try {
      const userFromStorage = await AsyncStorage.getItem("user");
      const uData = JSON.parse(userFromStorage);
      const avatarPic = await fetchGET('tags', 'avatar_' + uData.user_id);
       console.log('avpic', avatarPic);
      let avPic = '';
      if (avatarPic && avatarPic.length === 0) { // if avatar is not set
        avPic = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

      } else {
        avPic = mediaURL + avatarPic[0].filename;
      }
      setUser(user => ({
        userdata: uData,
        avatar: avPic
      }));

    } catch (e) {
      console.log("Profile error: ", e.message);
    }
  };
  useEffect(() => {
    userToState();
  }, []);

  const signOutAsync = async () => {
    await AsyncStorage.clear();
    props.navigation.navigate("Auth");
  };

  return (
    <Container>
      <Content>

          <CardItem style={styles.avaBackground}>

            <Body style={styles.center}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(true);
                }}
              >
                <Image
                  style={styles.roundImage}
                  source={{ uri: user.avatar }}
                />
                </TouchableOpacity>
            </Body>
          </CardItem>
          <CardItem style={[styles.center, {marginBottom:0}]}>
          {Platform.OS === 'ios' ? 
            (<Button 
              full 
              style={{ backgroundColor:'white', marginBottom: 0, marginTop: deviceHeight/30}}
              onPress={() => {
                props.navigation.push("ChangeAvatar");
              }}
            >
            <Icon style={{color: '#50514F', fontSize:40}} name="camera"></Icon>
            </Button>
            ) : (
              <Button 
              full 
              transparent
              style={{ backgroundColor:'white', marginBottom: 0, marginTop: deviceHeight/30}}
              onPress={() => {
                props.navigation.push("ChangeAvatar");
              }}
            >
            <Icon style={{color: '#50514F', fontSize:40}} name="camera"></Icon>
            </Button>
            )}
          </CardItem>
          
       
          <CardItem style={styles.center}>
            <Text style={[styles.username]}>{user.userdata.username}</Text>
            {Platform.OS === 'ios' ?
              (<Button style={styles.logout_btn} onPress={signOutAsync}>
                <Icon style={styles.logout_icon} name='log-out'></Icon>
              </Button>
              ) : (

              <Button transparent style={styles.logout_btn} onPress={signOutAsync}>
                <Icon style={styles.logout_icon} name='log-out'></Icon>
              </Button>
            )}
          </CardItem>

          <CardItem style={{marginTop:0}}>
            <Body style={styles.center}>
              {user.userdata.full_name !==null && <Text>Fullname: {user.userdata.full_name}</Text>}
              <Text numberOfLines={1}>email: {user.userdata.email}</Text>
            </Body>
          </CardItem>

          <CardItem footer bordered>          
            <View style={styles.flex}>
              
              <Button 
                full
                style= { {flex:1, backgroundColor: '#247BA0'}}
                onPress={() => {
                  props.navigation.push("Booked");
                }}
                >
                <Text> Your bookings</Text>
                <Icon style={{fontSize: 30}} name="checkmark" />
              </Button>
              <Button
                full
                style={[styles.editBtn]}
                onPress={() => {
                  props.navigation.push("ModifyUserInfo", {user: user});
                }}
              >
                <Icon style={styles.editIcon} name="settings"/>
              </Button>
              </View>
          </CardItem>
          {/* Add new place button */}
          <CardItem footer bordered>
            <View style={styles.flex}>
              
              <Button
                full
                style= { {flex:1, backgroundColor: '#F25F5C'}}
                onPress={() => {
                  props.navigation.push("Upload");
                }}
              >
                <Text>Add new place</Text>
                <Icon name="add-circle" />
              </Button>
              
            </View>
          </CardItem>
          
          
          {/* List all of the current user's files */}
          <List navigation={navigation} mode={'myfiles'}></List>

          {/* Modal */}
          <Modal
            animationType="fade"
            transparent={false}
            visible= {modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <View style={{marginTop: deviceHeight/10, alignItems: 'center'}}>
              <View>
              <TouchableOpacity
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}>
                  <Icon name='close' style={{color: 'red', fontSize: 50}}></Icon>
              </TouchableOpacity>
                <Image
                  style={{width: deviceWidth/1.2, height: deviceWidth/1.2, resizeMode: 'stretch'}}
                  source={{uri: user.avatar}}
                />
              </View>
            </View>
          </Modal>

      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  roundImage: {
    marginTop: deviceHeight/13,
    borderRadius: deviceHeight/8,
    height: deviceHeight/4,
    aspectRatio: 1, 
  },
  editBtn: {
    backgroundColor:'#50514F',
  },
  avaBackground : {
    height: deviceHeight / 4,
    width: '100%',
    zIndex:1,
    backgroundColor: 'white',
  },
  username: {
    fontSize: 28,
    fontWeight: "700",
  },
  center: {
    alignItems: 'center',
    justifyContent:'center',
  },
  logout_btn: {
    ...Platform.select({
      ios: {
        backgroundColor: 'white',
      },
      android: {
        backgroundColor: 'white',
      },
    }),
  },
  logout_icon: {
    color: '#CC2936',
    marginRight: 2,
    ...Platform.select({
      ios: {
        backgroundColor: 'white',
      },
      android: {
        color: 'red',
      },
    }),
  },
  flex: {
    flexDirection: 'row',
  },
  editAva_btn: {
    marginBottom: 0,
    marginTop: deviceHeight/20,
  }
});
Profile.propTypes = {
  navigation: PropTypes.object
};

export default Profile;