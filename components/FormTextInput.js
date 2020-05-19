import React from 'react';
import { Badge, Body, Input, Item, Text } from 'native-base';
import PropTypes from 'prop-types';

const FormTextInput = (props) => {
  const {error, ...otherProps} = props;
  return (
    <Body>
      <Item>
        <Input
          {...otherProps}
        />
      </Item>
      {error &&
      <Badge><Text>{error}</Text></Badge>
      }
    </Body>
  );
};

FormTextInput.propTypes = {
  success: PropTypes.bool,
  error: PropTypes.string,
  autoCapitalize: PropTypes.string,
  value: PropTypes.string,
  secureTextEntry: PropTypes.bool,
  onChangeText: PropTypes.func,
  onEndEditing: PropTypes.func,
  placeholder: PropTypes.string,
};

export default FormTextInput;
