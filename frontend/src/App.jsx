import { useState } from 'react'
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import './App.css'
import "@shopify/polaris/build/esm/styles.css";
import enTranslations from '@shopify/polaris/locales/en.json';
import { AppProvider, Page, LegacyCard, Button } from '@shopify/polaris';
import Login from './pages/Login/Login';
import ProtectedRouteHOC from './ProtectedRoute';
import Dashboard from './pages/Home/Dashboard';
import StoreDetail from './pages/StoreDetial/StoreDetail';
import UserContextProvider from '../context/User';
import UserNotLogin from './UserNotLogin';

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  console.log("isLogin=>", isLoggedIn);

  return (
    <>

      <AppProvider i18n={enTranslations}>
        <UserContextProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<ProtectedRouteHOC />}>
                <Route path='' element={<Dashboard />} />
                <Route path='/storeDetail' element={<StoreDetail />} />
              </Route>
              <Route path="/" element={<UserNotLogin />}>
                <Route path='login' element={<Login />} />
              </Route>

              {/* <Route path="/login">
            {isLoggedIn ? navigate("/dashboard") : <Login setLoggedIn={setLoggedIn} />}
          </Route>
          <ProtectedRouteHOC isLoggedIn={isLoggedIn}>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
            <Route path="/installation">
              ""
            </Route>
          </ProtectedRouteHOC> */}
            </Routes>
          </BrowserRouter>
        </UserContextProvider>
      </AppProvider>
    </>
  )
}

export default App
