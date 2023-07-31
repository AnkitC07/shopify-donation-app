import { BrowserRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NavigationMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";


import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
} from "./components";
import { MainContextProvider } from "./context/MainContext";
import AppStart from "./AppStart";

export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");
  const { t } = useTranslation();

  return (
    <MainContextProvider>
      <PolarisProvider>
        <BrowserRouter>
          <AppBridgeProvider>
            <QueryProvider>
              <NavigationMenu
                navigationLinks={[
                  {
                    label: t("Home"),
                    destination: "/",
                  },
                  {
                    label: t("Analytics"),
                    destination: "/analytics",
                  },
                  {
                    label: t("Settings"),
                    destination: "/settings",
                  },
                  {
                    label: t("Product Footprints"),
                    destination: "/productFootprints",
                  },
                  {
                    label: t("Billing History"),
                    destination: "/billingHistory",
                  },
                ]}
              />
              <Routes pages={pages} />
              <AppStart />
            </QueryProvider>
          </AppBridgeProvider>
        </BrowserRouter>
      </PolarisProvider>
    </MainContextProvider>
  );
}
