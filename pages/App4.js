import React, { useState, useRef, useEffect } from 'react';
import UserProvider from '../context/provider';
import Router from './Router';
import { NavigationContainer } from '@react-navigation/native';


const App = () => {
  const [currentRoute, setCurrentRoute] = useState('');
  const navigationRef = useRef();

  

  return (
    <UserProvider>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          setCurrentRoute(navigationRef.current.getCurrentRoute().name);
        }}
        onStateChange={() => {
          const route = navigationRef.current.getCurrentRoute();
          if (route) {
            setCurrentRoute(route.name);
          }
        }}
      >
        <Router currentRoute={currentRoute} />
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;
