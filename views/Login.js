import React, {useState} from 'react';
import {
  Container,
  Header,
  Body,
  Title,
  Content,
  Form,
  Button,
  Text,
  Item,
  H2,
  Card,
  CardItem,
  Icon,
  Label,
} from 'native-base';
import {
  AsyncStorage,
  StyleSheet,
  Dimensions,
  Image,
  View
} from 'react-native';
import PropTypes from 'prop-types';
import {fetchPOST} from '../hooks/APIHooks';
import FormTextInput from '../components/FormTextInput';
import useSignUpForm from '../hooks/LoginHooks';

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const Login = (props) => {
  const [toggleForm, setToggleForm] = useState(true);
  const {
    handleUsernameChange,
    handlePasswordChange,
    handleEmailChange,
    handleFullnameChange,
    handleConfirmPasswordChange,
    validateField,
    validateOnSend,
    checkAvail,
    inputs,
    errors,
    setErrors,
  } = useSignUpForm();

  const validationProperties = {
    username: {username: inputs.username},
    email: {email: inputs.email},
    full_name: {full_name: inputs.full_name},
    password: {password: inputs.password},
    confirmPassword: {
      password: inputs.password,
      confirmPassword: inputs.confirmPassword,
    },
  };

  const signInAsync = async () => {
    try {
      const user = await fetchPOST('login', inputs);
      console.log('Login', user);
      await AsyncStorage.setItem('userToken', user.token);
      await AsyncStorage.setItem('user', JSON.stringify(user.user));
      props.navigation.navigate('App');
    } catch (e) {
      console.log('signInAsync error: ' + e.message);
      setErrors((errors) =>
        ({
          ...errors,
          fetch: e.message,
        }));
    }
  };
  const registerAsync = async () => {
    const regValid = validateOnSend(validationProperties);
    console.log('reg field errors', errors);
    if (!regValid) {
      return;
    }

    try {
      console.log('sen inputs', inputs);
      const user = inputs;
      delete user.confirmPassword;
      const result = await fetchPOST('users', user);
      console.log('register', result);
      signInAsync();
    } catch (e) {
      console.log('registerAsync error: ', e.message);
      setErrors((errors) =>
        ({
          ...errors,
          fetch: e.message,
        }));
    }
  };


  return (
    <Container >
      <Content style={{display: 'flex'}} >
      <CardItem style={styles.titleContainer}>
        <Text style={styles.title}>Clould Home</Text>    
      </CardItem>
        {/* login form */}
        {toggleForm &&
        <Form style={styles.form}>

          <Item inlineLabel>
            <Label>username</Label>
            <FormTextInput
              autoCapitalize='none'
              value={inputs.username}
              onChangeText={handleUsernameChange}
            />
          </Item>
          <Item inlineLabel>
            <Label>password</Label>
            <FormTextInput
              autoCapitalize='none'
              value={inputs.password}
              secureTextEntry={true}
              onChangeText={handlePasswordChange}
            />
          </Item>
          <CardItem style={styles.registerContainer}>
            <Button style={styles.login_btn} onPress={signInAsync}>
              <Text >Login</Text>
            </Button>
            <CardItem style={styles.registerBtn_card}>
              <Text>Don't have account?</Text>
              <Button  transparent onPress={() => {
                setToggleForm(false);
              }}>
                <Text style={styles.register_toggle}>Register</Text>
              </Button>
            </CardItem>
          </CardItem>
          
        </Form>
        }

        {/* register form */}
        {!toggleForm &&
        <Form style={styles.form}>
        <Item stackedLabel>
            <Label>username</Label>
            <FormTextInput
              autoCapitalize='none'
              value={inputs.username}
              onChangeText={handleUsernameChange}
              onEndEditing={() => {
                checkAvail();
                validateField(validationProperties.username);
              }}
              error={errors.username}
            />
          </Item>
          <Item stackedLabel>
            <Label>email</Label>
            <FormTextInput
              autoCapitalize='none'
              value={inputs.email}
              onChangeText={handleEmailChange}
              onEndEditing={() => {
                validateField(validationProperties.email);
              }}
              error={errors.email}
            />
          </Item>
          <Item stackedLabel>
            <Label>fullname</Label>
            <FormTextInput
              autoCapitalize='none'
              value={inputs.full_name}
              onChangeText={handleFullnameChange}
              onEndEditing={() => {
                validateField(validationProperties.full_name);
              }}
              error={errors.full_name}
            />
          </Item>
          <Item stackedLabel>
            <Label>password</Label>
            <FormTextInput
              autoCapitalize='none'
              value={inputs.password}
              secureTextEntry={true}
              onChangeText={handlePasswordChange}
              onEndEditing={() => {
                validateField(validationProperties.password);
              }}
              error={errors.password}
            />
          </Item>
          <Item stackedLabel>
            <Label>confirm password</Label>
            <FormTextInput
              autoCapitalize='none'
              value={inputs.confirmPassword}
              secureTextEntry={true}
              onChangeText={handleConfirmPasswordChange}
              onEndEditing={() => {
                validateField(validationProperties.confirmPassword);
              }}
              error={errors.confirmPassword}
            />
          </Item>
          <CardItem style={styles.registerContainer}>
            <Button style={styles.register_btn} onPress={registerAsync}>
              <Text >Register</Text>
            </Button>

            <CardItem style={styles.loginBtn_card}>
              <Text>Already have an account?</Text>
              <Button  transparent onPress={() => {
                setToggleForm(true);
              }}>
                <Text style={styles.login_toggle}>Login</Text>
              </Button>
            </CardItem>
          </CardItem>
          
        </Form>
        }
      </Content>
    </Container>
  );
};
const styles = StyleSheet.create({
  titleContainer: {

    display: 'flex', 
    justifyContent: 'center', 
    marginTop: deviceHeight/9,
  },
  title: {
    fontWeight: '700',
    fontSize: 40,
    color: '#ED9B40'
  },
  form: {
    marginTop: 25,
    marginRight: deviceWidth/9,
    marginLeft: deviceWidth/12
  },
  registerContainer: {
    flexDirection: "column", 

  }, 
  login_btn: {
    marginTop:25,
    padding: deviceWidth/15,
    backgroundColor: '#61C9A8'
  },
  register_btn: {
    marginTop:25,
    padding: deviceWidth/15,
    backgroundColor: '#BA3B46'
  },

  register_toggle : {
    fontWeight: '500',
    color: "#BA3B46",
  },
  login_toggle : {
    fontWeight: '500',
    color: '#61C9A8',
  }
});
// proptypes here
Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
