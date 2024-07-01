import React,{Suspense} from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import "./index.css"
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
                <Suspense fallback={<div>Loading...</div>}>
                  <Component />
                </Suspense>
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
                <Suspense fallback={<div>Loading...</div>}><Component /></Suspense>
              }
            ></Route>
            <Route path="/" element={<Navigate to="/login" />} />
            </>
          ))}
  </Routes>
  </BrowserRouter>
  </Provider>
  </React.Suspense>,
)
