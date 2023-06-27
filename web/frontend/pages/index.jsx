
import "../assets/App.css"
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";

import { useCallback, useState } from "react";
import HomeIndex from "../components/Home/Index";
import AnalyticsIndex from "../components/Analytics/Index";
import { Page } from "@shopify/polaris";

export default function HomePage() {

  const { t } = useTranslation();
  return (
    <div className="container-fluid">
      <Page fullWidth>
        <TitleBar title={t("Emissa")} primaryAction={null} />
        <HomeIndex />
      </Page>
    </div>
  );
}
