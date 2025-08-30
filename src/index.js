import React from 'react';
import ReactDOM from 'react-dom/client';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { createNormalizedTheme } from './system/normalize';
import App from './App';
import Login from './page/login';
import RegistrationPage from './page/registration';

import './fonts/stylesheet.css';
import './style/global.scss';
import { LoadingProvider, useLoading } from './contexts/LoadingContext';
import { setGlobalLoadingSetter } from './system/axios';
import ErrorBoundary from './system/boot';
import { tips } from './system/data';
import initPerformanceOptimizations from './system/performance';
import { Provider } from 'react-redux';
import store from './system/redux/store';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // ✅ исправлено

const EpicLoader = () => {
  const { loading, initialLoading } = useLoading();
  const [tipIndex, setTipIndex] = React.useState(
    () => Math.floor(Math.random() * tips.length)
  );

  React.useEffect(() => {
    if (!initialLoading && !loading) return;
    const timer = setTimeout(() => {
      if (initialLoading || loading) {
        setTipIndex(prev => (prev + 1) % tips.length);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [initialLoading, loading]);

  if (!initialLoading && !loading) return null;
  return <></>;
};

const EpicLoaderInit = ({ children }) => {
  const { setLoading } = useLoading();
  React.useEffect(() => {
    setGlobalLoadingSetter(setLoading);
  }, [setLoading]);
  return <>{children}</>;
};

initPerformanceOptimizations();

const theme = createNormalizedTheme(createTheme());

// Проверка токена локально
const token = localStorage.getItem("token");
const isAuth = Boolean(token);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <LoadingProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ErrorBoundary>
            <EpicLoaderInit>
              <EpicLoader />
              {isAuth ? (
                <App />
              ) : (
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/registration" element={<RegistrationPage />} />
                  </Routes>
                </BrowserRouter>
              )}
            </EpicLoaderInit>
          </ErrorBoundary>
        </ThemeProvider>
      </LoadingProvider>
    </Provider>
  </React.StrictMode>
);
