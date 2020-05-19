import React, {useContext, useEffect, useState} from "react";
import {Button, Content, Form, Item, Spinner, Text, Label} from "native-base";

import {Dimensions} from "react-native";
import PropTypes from "prop-types";
import FormTextInput from "../components/FormTextInput";
import useUploadForm from "../hooks/UploadHooks";
import {MediaContext} from "../contexts/MediaContext";
import {validateField} from "../utils/validation";
import {uploadConstraints} from "../constants/validationConst";
import {mediaURL} from "../constants/urlConst";
import AsyncImage from "../components/AsyncImage";
import {Video} from "expo-av";

const deviceHeight = Dimensions.get("window").height;

const Modify = props => {
  const [media, setMedia] = useContext(MediaContext);
  const [send, setSend] = useState(false);

  let {
    handleTitleChange,
    handleCapacityChange,
    handleDescriptionChange,
    handleLocationChange,
    handlePriceChange,
    handleModify,
    inputs,
    errors,
    loading,
    setErrors,
    setInputs,
  } = useUploadForm();

  const validationProperties = {
    title: {title: inputs.title},
    description: {description: inputs.info.description},
    price: {price: inputs.info.price},
    capacity: {capacity: inputs.info.capacity},
    location: {location: inputs.info.location},
  };

  const validate = (field, value) => {
    console.log('vp', validationProperties[field]);
    setErrors((errors) =>
      ({
        ...errors,
        [field]: validateField({[field]: value},
          uploadConstraints),
        fetch: undefined,
      }));
  };
  
  //Get data of single file
  const file = props.navigation.state.params.file;
  const fileInfo= JSON.parse(file.description);

  useEffect(() => {
    setInputs(inputs => ({
      ...inputs,
      title: file.title,
      info: fileInfo
    }));
  }, []);

  //Handle change of information
  const handleTitle = text => {
    handleTitleChange(text);
 
  };

  const handleDescription = text => {
    handleDescriptionChange(text);
    validate('description', text);
  };

  const handleLocation = text => {
    handleLocationChange(text);
    
  };
  const handleCapacity = text => {
    handleCapacityChange(text);
  };
  const handlePrice = text => {
    handlePriceChange(text);
  };

  const modify = () => {
    console.log("reg field errors", errors);
    handleModify(file.file_id, props.navigation, setMedia);
  };

  const checkErrors = () => {
    console.log("errors", errors);
    if (errors.title !== undefined || errors.description !== undefined) {
      setSend(false);
    } else {
      setSend(true);
    }
  };

  useEffect(() => {
    checkErrors();
  }, [errors]);

  console.log("send", send);

  return (
    <Content>
      {loading ? (
        <Spinner />
      ) : (
          <Form>
            <Item inlineLabel>
              <Label>Title</Label>
              <FormTextInput
                onChangeText={handleTitle}
                value={inputs.title}
                onEndEditing={() => {
                  validate('title', inputs.title);
                }}
                error={errors.title}
              />
            </Item>
            <Item inlineLabel>
              <Label>Location</Label>
              <FormTextInput
                onChangeText={(e) => {handleLocation(e)}}
                value={inputs.info.location}
                onEndEditing={() => {
                  validate('location', inputs.info.location);
                }}
                error={errors.location}
              />
            </Item>
            <Item inlineLabel>
              <Label>Capacity</Label>
              <FormTextInput
                onChangeText={handleCapacity}
                value={inputs.info.capacity}
                onEndEditing={() => {
                  validate('capacity', inputs.info.capacity);
                }}
                error={errors.capacity}
              />
            </Item>
            <Item inlineLabel>
              <Label >Price</Label>
              <FormTextInput
                onChangeText={handlePrice}
                value={inputs.info.price}
                onEndEditing={() => {
                  validate('price', inputs.info.price);
                }}
                error={errors.price}
              />
            </Item>
            <Item inlineLabel>
              <Label>Description</Label>
              <FormTextInput
                onChangeText={handleDescription}
                value={inputs.info.description}
                onEndEditing={() => {
                  validate('description', inputs.info.description);
                }}
                error={errors.description}
              />
            </Item>
            {file.media_type === "image" ? (
              <AsyncImage
                style={{
                  width: "100%",
                  height: deviceHeight / 2
                }}
                spinnerColor="#777"
                source={{uri: mediaURL + file.filename}}
              />
            ) : (
                <Video
                  source={{uri: mediaURL + file.filename}}
                  useNativeControls
                  style={{
                    width: "100%",
                    height: deviceHeight / 2
                  }}
                  onError={e => {
                    console.log("video error", e);
                  }}
                />
              )}
            {send && (
              <Button full onPress={modify}>
                <Text>Send</Text>
              </Button>
            )}
          </Form>
          
        )}
    </Content>
  );
};

// proptypes here
Modify.propTypes = {
  navigation: PropTypes.object
};

export default Modify;