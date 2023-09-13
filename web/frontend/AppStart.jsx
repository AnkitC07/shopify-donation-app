import React from "react";
import { useContext, useEffect, useState } from "react";
import { MainContext } from "./context/MainContext";
import { useAuthenticatedFetch } from "./hooks";

const AppStart = () => {
  const fetch = useAuthenticatedFetch();
  const { setDesign, setEnabled, setPassword, setIsActive, setOnboarding } =
    useContext(MainContext);

  console.log("testing index page");

  useEffect(() => {
    const getStoreDetails = async () => {
      try {
        const fetchData = await fetch(`/api/getStoreData`);
        const getdata = await fetchData.json();
        if (getdata.status == 200) {
          if (getdata.data == null) {
            setOnboarding({ loading: false, status: true });
            return;
          }
          console.log("app start==", getdata);
          setDesign(getdata.data.design);
          setEnabled(getdata.data.appStatus);
          if (getdata?.data?.password && getdata?.data?.password != "") {
            setIsActive(false);
          }
          setPassword(getdata?.data?.password);
          if (getdata.data.onboarding == true) {
            setOnboarding({ loading: false, status: true });
          } else {
            setOnboarding({ loading: false, status: false });
          }
        } else {
          setOnboarding({ loading: true, status: true });
        }
      } catch (error) {
        console.log(error);
      }
    };
    getStoreDetails();
  }, []);
  return <></>;
};

export default AppStart;
