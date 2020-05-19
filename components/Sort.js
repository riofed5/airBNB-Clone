import React, { Component } from "react";
import { Form, Icon, Picker, View } from "native-base";
import PropTypes from 'prop-types';

export default class Sort extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: "Sort by"
    };
  }

  onValueChange(value) {
    this.setState({
      selected: value
    }, this.props.setOption(value));

  }
  render() {
    return (
      <View>
        <Form>
          <Picker
            mode="dropdown"
            iosHeader="Select option"
            iosIcon={<Icon name="arrow-dropdown-circle" style={this.state.selected !== "Sort by" ? {color: "#007aff", fontSize: 25} : {}} />}
            placeholder={this.state.selected}
            style={{marginHorizontal: 20, paddingHorizontal: 0, borderWidth: 1}}
            selectedValue={this.state.selected}
            onValueChange={this.onValueChange.bind(this)}
          >
            <Picker.Item label="Alphabetical Order" value="Alphabetical Order"/>
            <Picker.Item label="Price Ascending" value="Price Ascending"/>
            <Picker.Item label="Price Decending" value="Price Decending"/>
          </Picker>
        </Form>
      </View>
    );
  }
}

Sort.propTypes = {
  setOption: PropTypes.func,
};
