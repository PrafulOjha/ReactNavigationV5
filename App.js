/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {Text, View, Button, Easing, TextInput} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useTheme,
} from '@react-navigation/native';
import {AppearanceProvider, useColorScheme} from 'react-native-appearance';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {useIsFocused} from '@react-navigation/core';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const Drawer = createDrawerNavigator();

const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 50,
    mass: 3,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

const closeConfig = {
  animation: 'timing',
  config: {
    duration: 500,
    easing: Easing.linear,
  },
};

const HomeScreen = ({navigation}) => {
  navigation.setOptions({
    headerRight: () => (
      <Button
        title="Save"
        onPress={() => {
          //save the changes
          navigation.replace('Home');
        }}
      />
    ),
  });
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>HomeScreen</Text>
      <Button
        title="Go To Details Screen"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
};

const SettingsScreen = ({navigation}) => {
  const isFocused = useIsFocused();
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{color: isFocused ? 'green' : 'black'}}>SettingsScreen</Text>
      <Button
        title="Go To Home Screen"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
};

const FeedScreen = (props) => (
  <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
    <Text>FeedScreen</Text>
  </View>
);

const DetailsScreen = (props) => (
  <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
    <Text>DetailsScreen</Text>
  </View>
);

const HomeStackNavigator = ({navigation, route}) => {
  if (route.state) {
    navigation.setOptions({
      tabBarVisible: route.state.index > 0 ? false : true,
    });
  }
  return (
    <HomeStack.Navigator
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
      headerMode="float">
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Details" component={DetailsScreen} />
    </HomeStack.Navigator>
  );
};

function SettingHomeScreen({navigation}) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Button
        onPress={() => navigation.navigate('Notifications')}
        title="Go to notifications"
      />
    </View>
  );
}

function NotificationsScreen({navigation}) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}

const SettingDrawerNavigator = ({navigation}) => {
  return (
    <Drawer.Navigator initialRouteName="SettingHome">
      <Drawer.Screen name="SettingHome" component={SettingHomeScreen} />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} />
    </Drawer.Navigator>
  );
};

const HomeTabNavigator = ({navigation}) => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          let iconName;
          if (route.name == 'Home') {
            iconName = 'ios-home';
          } else if (route.name == 'Feed') {
            iconName = 'logo-rss';
          } else if (route.name == 'Settings') {
            iconName = 'ios-settings';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Settings" component={SettingDrawerNavigator} />
    </Tab.Navigator>
  );
};

function getHeaderTitle(route) {
  const routeName = route.state
    ? route.state.routes[route.state.index].name
    : 'Home';
  switch (routeName) {
    case 'Home':
      return 'Home';
    case 'Feed':
      return 'Feed';
    case 'Settings':
      return 'Settings';
  }
}

function shouldHeaderBeShown(route) {
  const routeName = route.state
    ? route.state.routes[route.state.index].name
    : 'Home';
  switch (routeName) {
    case 'Home':
      return false;
  }
}

const App: () => React$Node = () => {
  const scheme = useColorScheme();
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({type: 'RESTORE_TOKEN', token: userToken});
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
      },
      signOut: () => dispatch({type: 'SIGN_OUT'}),
      signUp: async (data) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
      },
    }),
    [],
  );

  const AuthContext = React.createContext();

  function SignInScreen() {
    const {colors} = useTheme();
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const {signIn} = React.useContext(AuthContext);

    return (
      <View style={{backgroundColor: colors.text}}>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={{color: colors.background}}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{color: colors.background}}
        />
        <Button title="Sign in" onPress={() => signIn({username, password})} />
      </View>
    );
  }

  return (
    <AppearanceProvider>
      <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthContext.Provider value={authContext}>
          <Stack.Navigator
            screenOptions={{
              gestureEnabled: true,
              gestureDirection: 'horizontal',
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              // transitionSpec: {
              //   open: config,
              //   close: closeConfig,
              // },
            }}
            headerMode="float"
            animation="fade">
            {state.userToken == null ? (
              <Stack.Screen name="SignIn" component={SignInScreen} />
            ) : (
              <Stack.Screen
                options={({route}) => ({
                  title: getHeaderTitle(route),
                  headerShown: shouldHeaderBeShown(route),
                })}
                name="Home"
                component={HomeTabNavigator}
              />
            )}
          </Stack.Navigator>
        </AuthContext.Provider>
      </NavigationContainer>
    </AppearanceProvider>
  );
};

export default App;
