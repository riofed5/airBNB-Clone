import { useState } from "react";
import validate from "validate.js";
import { fetchGET, fetchPUT } from "./APIHooks";
import { registerConstraints } from "../constants/validationConst";
import { AsyncStorage } from "react-native";

const useSignUpForm = () => {
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const handleUsernameChange = text => {
    setInputs(inputs => ({
      ...inputs,
      username: text
    }));
  };

  const handlePasswordChange = text => {
    setInputs(inputs => ({
      ...inputs,
      password: text
    }));
  };

  const handleConfirmPasswordChange = text => {
    setInputs(inputs => ({
      ...inputs,
      confirmPassword: text
    }));
  };

  const handleEmailChange = text => {
    setInputs(inputs => ({
      ...inputs,
      email: text
    }));
  };
  const handleFullnameChange = text => {
    setInputs(inputs => ({
      ...inputs,
      full_name: text
    }));
  };

  const validateField = attr => {
    // eslint-disable-next-line max-len
    const attrName = Object.keys(attr).pop(); // get the only or last item from array
    const valResult = validate(attr, registerConstraints);
    console.log("valresult", valResult);
    let valid = undefined;
    if (valResult[attrName]) {
      valid = valResult[attrName][0]; // get just the first message
    }
    setErrors(errors => ({
      ...errors,
      [attrName]: valid,
      fetch: undefined
    }));
  };

  const checkAvail = async () => {
    const text = inputs.username;
    try {
      const result = await fetchGET("users/username", text);
      console.log(result);
      if (!result.available) {
        setErrors(errors => ({
          ...errors,
          username: "Username not available."
        }));
      }
    } catch (e) {
      setErrors(errors => ({
        ...errors,
        fetch: e.message
      }));
    }
  };

  const validateOnSend = fields => {
    checkAvail();

    for (const [key, value] of Object.entries(fields)) {
      console.log(key, value);
      validateField(value);
    }

    return (
      errors.username === undefined ||
      errors.email === undefined ||
      errors.full_name === undefined ||
      errors.password === undefined ||
      errors.confirmPassword === undefined
    );
  };
  const handleUserInfoModify = async (navigation, setUser) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const resp = await fetchPUT("users", "", inputs, token);

      if (resp.message) {
        const userFromStorage = await AsyncStorage.getItem("user");

        const data = await fetchGET("users/user", "", token);
        let tempUser = {...JSON.parse(userFromStorage)};

        if (data.username !== tempUser.username) {
          tempUser.username = data.username;
        }
        if (data.email !== tempUser.email) {
          tempUser.email = data.email;
        }
        AsyncStorage.setItem("user", JSON.stringify(tempUser));
        setUser(user => ({
          ...user,
          userdata: data
        }));

        setLoading(false);
        console.log(navigation);
        navigation.push("Profile");
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  return {
    handleUsernameChange,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleEmailChange,
    handleFullnameChange,
    handleUserInfoModify,
    checkAvail,
    validateField,
    validateOnSend,
    inputs,
    setInputs,
    errors,
    setErrors
  };
};

export default useSignUpForm;
