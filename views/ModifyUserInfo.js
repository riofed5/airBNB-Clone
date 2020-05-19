import React, { useContext, useEffect, useState } from "react";
import { Button, Content, Form, Item, Spinner, Text } from "native-base";

import { Dimensions } from "react-native";
import PropTypes from "prop-types";
import FormTextInput from "../components/FormTextInput";
import { MediaContext } from "../contexts/MediaContext";
import { registerConstraints } from "../constants/validationConst";
import AsyncImage from "../components/AsyncImage";
import useSignUpForm from "../hooks/LoginHooks";

const deviceHeight = Dimensions.get("window").height;

const ModifyUserInfo = props => {
  const [media, setMedia] = useContext(MediaContext);
  const [password, setPassword]=useState('');
  const [confirmPassword, setConfirmpassword] = useState('');
  let sendToggle = true;
  const [send, setSend] = useState(false);
  const [user, setUser] = useState({
    userdata: {},
    avatar: "https://"
  });

  const {
    handleUsernameChange,
    handlePasswordChange,
    handleEmailChange,
    handleConfirmPasswordChange,
    handleUserInfoModify,
    inputs,
    errors,
    setErrors,
    setInputs,
    loading,
    checkAvail,
    validateField
  } = useSignUpForm();

  const validationProperties = {
    username: { username: inputs.username },
    email: { email: inputs.email },
    password: { password: inputs.password },
    confirmPassword: {
      password: inputs.password,
      confirmPassword: inputs.confirmPassword
    }
  };

  const validate = (field, value) => {
    console.log("vp", validationProperties[field]);
    setErrors(errors => ({
      ...errors,
      [field]: validateField({ [field]: value }, registerConstraints),
      fetch: undefined
    }));
  };

  const userInfo = props.navigation.state.params.user.userdata;
  const avatar = props.navigation.state.params.user.avatar;

  useEffect(() => {
    setInputs(inputs => ({
      ...inputs,
      username: userInfo.username,
      email: userInfo.email
    }));
  }, []);

  const handleUsername = text => {
    handleUsernameChange(text);
    validate("username", text);
  };

  const handlePassword = text => {
    setPassword(text);
    handlePasswordChange(text);
    validate("password", text);
  };
  const handleConfirmPassword = text => {
    setConfirmpassword(text);
    handleConfirmPasswordChange(text);
    validate("confirmPassword", text);
  };
  const handleEmail = text => {
    handleEmailChange(text);
    validate("email", text);
  };

  const checkPassword = () => {
    if (password!=='' && confirmPassword===''){
      sendToggle = false;
    }else {
      sendToggle = true;
    }
    return sendToggle
  }


  const modify = () => {
    if (errors) {
      console.log("errors from ModifyUserInfo Page: ", errors);
    }
    const user = inputs;
    delete user.confirmPassword;
    console.log(props.navigation);
    handleUserInfoModify(props.navigation, setUser);
  };

  const checkErrors = () => {
    console.log("errors", errors);
    if (
      errors.username !== undefined ||
      errors.password !== undefined ||

      errors.email !== undefined ||
      errors.confirmPassword !== undefined

    ) {
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
          <Item>
            <FormTextInput
              autoCapitalize="none"
              placeholder="Username"
              onChangeText={handleUsername}
              onEndEditing={() => {
                checkAvail();
              }}
              value={inputs.username}
              error={errors.username}
            />
          </Item>
          <Item>
            <FormTextInput
              autoCapitalize="none"
              placeholder="Password"
              secureTextEntry={true}
              value={inputs.password}
              onChangeText={handlePassword}

              error={errors.password}
            />
          </Item>
          <Item>
            <FormTextInput
              autoCapitalize='none'
              value={inputs.confirmPassword}
              placeholder='confirm password'
              secureTextEntry={true}
              onChangeText={handleConfirmPassword}
              onEndEditing={() => {
                validateField(validationProperties.confirmPassword);
              }} 
              error={errors.confirmPassword}
            />
            </Item>
          <Item>
            <FormTextInput
              autoCapitalize="none"
              placeholder="Email"
              onChangeText={handleEmail}
              value={inputs.email}
              error={errors.email}
            />
          </Item>
          <AsyncImage
            style={{
              width: "100%",
              height: deviceHeight / 2.5
            }}
            spinnerColor="#777"
            source={{ uri: avatar }}
          />

          {send && checkPassword() &&(
            <Button full onPress={modify} style={{}}>
              <Text>Send</Text>
            </Button>
          )}
        </Form>
      )}
    </Content>
  );
};

// proptypes here
ModifyUserInfo.propTypes = {
  navigation: PropTypes.object
};

export default ModifyUserInfo;
