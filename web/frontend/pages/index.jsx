import "../assets/App.css";
import { useTranslation, Trans } from "react-i18next";
import HomeIndex from "../components/Home/Index";
import { MainContext } from "../context/MainContext";
import { useContext } from "react";

export default function HomePage() {
    const { t } = useTranslation();
    const { onboardingScreen, setOnboarding } = useContext(MainContext);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const charge = urlParams.get("charge_id");
    if (charge) console.log("charge=>", charge);
    else console.log("nothing");
    // const fetch = useAuthenticatedFetch()
    // const { setDesign, setEnabled, setPassword } = useContext(MainContext)
    // const [onboardingScreen, setOnboarding] = useState({
    //   loading: true,
    //   status: false,
    // });
    // console.log('testing index page')

    // useEffect(() => {
    //   const getStoreDetails = async () => {
    //     try {
    //       const fetchData = await fetch(`/api/getStoreData`);
    //       const getdata = await fetchData.json();
    //       if (getdata.status == 200) {

    //         if (getdata.data == null) {
    //           setOnboarding({ loading: false, status: true });
    //           return;
    //         }
    //         console.log(getdata)
    //         setDesign(getdata.data.design)
    //         setEnabled(getdata.data.appStatus)
    //         if (getdata.data.onboarding == true) {
    //           setOnboarding({ loading: false, status: true });
    //         } else {
    //           setOnboarding({ loading: false, status: false });
    //         }
    //       } else {
    //         setOnboarding({ loading: true, status: true });
    //       }
    //     } catch (error) {
    //       console.log(error)
    //     }

    //   }
    //   getStoreDetails()
    // }, []);

    return (
        <div className="container-fluid page_margin">
            <HomeIndex />
        </div>
    );
}
