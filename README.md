# ReactNavigationV5
Please follow these instructions when you start coding on this project for first time. To run it properly

### 1) For GIT Clone

```sh
git clone https://github.com/PrafulOjha/ReactNavigationV5.git
```

### 2) Package Install

```sh
npm install
```

### 3) Install Pod

```sh
cd ios && pod install
```

### 4) Clear Cache

```sh
watchman watch-del-all
rm -rf $TMPDIR/react-*
```

### 5) Run Bundle command for Android

```sh
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/
```

### 6) Run Bundle command for iOS

```sh
react-native bundle --entry-file ./index.js --platform ios --bundle-output ios/main.jsbundle --assets-dest ./ios
```


# Repository Content: 
#### 1) React-Native Version 62.2

#### 2) React-Navigation Version 5

#### 3) New Authentication Flow

#### 4) Implimentation of Stack, Botton-Tab and Drawer Navigation

# Upcoming Content: 
#### 1) Firebase Authentication And Social Login

#### 2) Folder Structure

#### 3) Push Notification And Local Notification