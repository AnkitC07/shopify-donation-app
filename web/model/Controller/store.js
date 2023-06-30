import Stores from "../Stores.js";

const addStore = async (shopName, storetoken) => {
  try {
    const findShop = await Stores.findOne({ storename: shopName });

    if (!findShop) {
      const data = await Stores.create({
        storename: shopName,
        storetoken: storetoken,
        onboarding: true,
        appStatus: false,
        sub: ''
      },);
      return data;
    } else {
      await Stores.findOneAndUpdate(
        {
          storename: shopName,
        },
        {
          storetoken: storetoken,
        }
      );
    }
  } catch (error) {
  }
};

// export const getTimeAndDate = () => {
//   var currentDate = new Date();
//   var day = currentDate.getDate();
//   var month = currentDate.getMonth() + 1;
//   var year = currentDate.getFullYear();
//   var hours = currentDate.getHours();
//   var minutes = currentDate.getMinutes();
//   var seconds = currentDate.getSeconds();
//   var amOrPm = hours >= 12 ? 'PM' : 'AM';

//   // Pad the hours, minutes and seconds with leading zeros
//   hours = hours % 12;
//   hours = hours ? hours : 12; // the hour '0' should be '12'
//   minutes = minutes < 10 ? '0' + minutes : minutes;
//   seconds = seconds < 10 ? '0' + seconds : seconds;

//   // Format the date and time
//   var formattedDate = day + '/' + month + '/' + year;
//   var formattedTime = hours + ':' + minutes + ':' + seconds + ' ' + amOrPm;

//   // Combine the date and time in the desired format
//   var formattedDateTime = formattedDate + ', ' + formattedTime;

//   console.log(formattedDateTime);
//   return formattedDateTime
// }
export const updateId = async (shopName, sub) => {
  try {
    let findShop = await Stores.findOne({ storename: shopName });

    if (!findShop) {
      return;
    }

    findShop.sub = sub;
    return await findShop.save();
  } catch (error) {
    console.log('Error in Update Sub Id', error)
  }
};

export const updateStore = async (shopName) => {
  try {
    let findShop = await Stores.findOne({ storename: shopName });

    if (!findShop) {
      return;
    }

    findShop.onboarding = false;
    await findShop.save();
  } catch (error) {
    console.log("Error in Update Store/onboarding", error)
  }
};

export const getStoreAccessToken = async (shopName) => {
  console.log(shopName, "getStoreAccessToken function");
  try {
    const findShop = await Stores.findOne({ storename: shopName });
    console.log(findShop);
    return {
      shop: findShop.storename,
      token: findShop.storeAccessToken,
    };
  } catch (error) {
    console.log(error);
  }
};

export default addStore;
