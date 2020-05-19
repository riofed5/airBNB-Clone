import React, { useState } from 'react';
import { Image, View } from 'react-native';
import { Spinner } from 'native-base';
import PropTypes from 'prop-types';

const AsyncImage = (props) => {
  const [loaded, setLoaded] = useState(false);
  const onLoad = () => {
    setLoaded(true);
  };
  const {
    style,
    spinnerColor,
    source,
  } = props;
  console.log('loaded', loaded);
  return (
    <View style={[
      style]}>
      <Image
        source={source}
        style={props.style}
        onLoad={onLoad}/>
      {!loaded &&
      <View style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -13,
      }}>
        <Spinner color={spinnerColor}/>
      </View>
      }
    </View>
  );
};

AsyncImage.propTypes = {
  spinnerColor: PropTypes.string,
  style: PropTypes.object,
  source: PropTypes.object,
};

export default AsyncImage;
