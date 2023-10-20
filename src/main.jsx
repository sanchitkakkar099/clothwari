import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './assets/scss/bootstrap.scss'
import './assets/scss/app.scss'
import './assets/scss/icons.scss'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { privateRoutes, publicRoutes } from "./routes";
import { Provider } from "react-redux";
import { store } from "./redux/store";
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.Suspense fallback={""}>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
        {privateRoutes.map(({ path, Component }) => (
            <Route
              key={path}
              path={path}
              element={
                <App>
                  <Component />
                </App>
              }
            ></Route>
          ))}
          {publicRoutes.map(({ path, Component }) => (
            <>
            <Route
              key={path}
              path={path}
              element={
                  <Component />
              }
            ></Route>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            </>
          ))}
  </Routes>
  </BrowserRouter>
  </Provider>
  </React.Suspense>,
)
