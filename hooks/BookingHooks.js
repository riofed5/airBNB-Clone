import { useState } from "react";
import validate from "validate.js";
import { bookingConstraints } from "../constants/validationConst";

const useBookingForm = () => {
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
    const valResult = validate(attr, bookingConstraints);
    console.log("valresult", valResult);
    let valid = undefined;
    if (valResult[attrName]) {
      valid = valResult[attrName][0]; // get just the first message
    }
    setErrors(errors => ({
      ...errors,
      [attrName]: valid,
    }));
  };

  const validateOnSend = fields => {
    for (const [key, value] of Object.entries(fields)) {
      console.log(key, value);
      validateField(value);
    }

    return (
      errors.email === undefined ||
      errors.full_name === undefined
    );
  };

  return {
    handleEmailChange,
    handleFullnameChange,
    validateField,
    validateOnSend,
    inputs,
    setInputs,
    errors,
    setErrors
  };
};

export default useBookingForm;
