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
                sub: "",
                html: `<div id="checkbox_div" class="checkbox_wrapper" style="position: relative; display: flex; justify-content: end;">
          <div class="left_checkbox"
              style="display: inline-flex; align-items: center; gap: 10px; border: 1px solid rgb(209, 209, 209); padding: 10px 15px; background: rgb(255, 255, 255); color: rgb(0, 0, 0);">
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 36.6667V25L16.6667 21.6667" stroke="#53964D" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round"></path>
                  <path
                      d="M28.3333 13.3333V14.6667C30.2709 15.7787 31.7802 17.5075 32.6207 19.5773C33.4612 21.6472 33.5844 23.9388 32.9707 26.0869C32.357 28.2349 31.0417 30.1155 29.2345 31.4289C27.4274 32.7423 25.2326 33.4127 23 33.3333H16.6667C14.3816 33.1782 12.2044 32.3028 10.448 30.8329C8.69151 29.3631 7.44609 27.3743 6.8906 25.1524C6.33511 22.9304 6.49813 20.5895 7.35624 18.466C8.21436 16.3425 9.72342 14.5456 11.6667 13.3333C11.6667 11.1232 12.5446 9.00358 14.1074 7.44078C15.6702 5.87797 17.7899 5 20 5C22.2101 5 24.3298 5.87797 25.8926 7.44078C27.4554 9.00358 28.3333 11.1232 28.3333 13.3333Z"
                      stroke="#53964D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                  <path d="M23.3333 23.3333L20 26.6667" stroke="#53964D" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round"></path>
              </svg>
              <div style="margin-right: 15px;">
                  <div style="display: inline-flex; gap: 3px; align-items: center;">
                      <h4 style="margin: 0px; font-size: 14px; font-weight: 600;">Reduce carbon footprint</h4>
                      <div class="tooltip"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                              xmlns="http://www.w3.org/2000/svg">
                              <path fill-rule="evenodd" clip-rule="evenodd"
                                  d="M8.75 8.75H7.25V8.639C7.25 7.982 7.4795 7.51475 8 7.25C8.28875 7.10375 8.75 6.824 8.75 6.5C8.75 6.08675 8.414 5.75 8 5.75C7.586 5.75 7.25 6.08675 7.25 6.5H5.75C5.75 5.2595 6.7595 4.25 8 4.25C9.2405 4.25 10.25 5 10.25 6.5C10.25 8 8.75 8.12375 8.75 8.75ZM7.25 11.75H8.75V10.25H7.25V11.75ZM8 2C4.6865 2 2 4.6865 2 8C2 11.3135 4.6865 14 8 14C11.3135 14 14 11.3135 14 8C14 4.6865 11.3135 2 8 2Z"
                                  fill="#5C5F62"></path>
                          </svg><span class="tooltiptext">By reducing the carbon footprint of your purchase, <b> 100% </b> of
                              your compensation is used to finance tree planting projects near you. Want to know more? Read
                              through our process with full transparency and track our live climate mitigation projects at
                              <span style="color: rgb(86, 178, 128);"> www.emissa.eu.</span></span></div>
                  </div>
                  <p style="margin: 3px 0px 0px; font-size: 9.5px; color: rgb(91, 91, 91);">Offset 1.62 kg CO2 with<span
                          style="color: rgb(83, 150, 77);">Emissa</span></p>
              </div>
              <div class="check_custom" style="display: flex; align-items: center;"><span
                      style="font-size: 12px; text-align: right;">€0.68</span><input type="checkbox" name="footprint"
                      id="reduce" style="accent-color: rgb(90, 157, 118); margin-left: 5px; height: 24px; width: 15px;"></div>
          </div>
      </div>`,
                design: {
                    "font-family": "default",
                    color: "#000000",
                    "border-color": "#d1d1d1",
                },
                productId: "",
                password: "",
            });
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
    } catch (error) {}
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
        console.log("Error in Update Sub Id", error);
    }
};
export const updateAppStatus = async (shopName, status) => {
    try {
        let findShop = await Stores.findOne({ storename: shopName });

        if (!findShop) {
            return;
        }

        findShop.appStatus = status;
        return await findShop.save();
    } catch (error) {
        console.log("Error in Update App Status ", error);
    }
};
export const updateHtml = async (shopName, html, design) => {
    try {
        let findShop = await Stores.findOne({ storename: shopName });

        if (!findShop) {
            return;
        }

        findShop.html = html;
        findShop.design = design;
        return await findShop.save();
    } catch (error) {
        console.log("Error in Update HTML ", error);
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
        console.log("Error in Update Store/onboarding", error);
    }
};
export const updateProductId = async (shopName, id) => {
    try {
        let findShop = await Stores.findOne({ storename: shopName });

        if (!findShop) {
            return;
        }

        findShop.productId = id;
        await findShop.save();
    } catch (error) {
        console.log("Error in Update Store/onboarding", error);
    }
};

export const getStoreAccessToken = async (shopName) => {
    console.log(shopName, "getStoreAccessToken function");
    try {
        const findShop = await Stores.findOne({ storename: shopName });
        console.log(findShop);
        return {
            shop: findShop.storename,
            accessToken: findShop.storetoken,
        };
    } catch (error) {
        console.log(error);
    }
};
export const getProductId = async (shopName) => {
    console.log(shopName, "getProductId function");
    try {
        const findShop = await Stores.findOne({ storename: shopName });
        console.log(findShop);
        return findShop.productId;
    } catch (error) {
        console.log(error);
    }
};

export default addStore;
