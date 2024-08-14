import { atom, DefaultValue } from "recoil";

const getInitialState = (key, defaultValue) => {
  const savedValue = sessionStorage.getItem(key);
  if (savedValue !== null) {
    try {
      return JSON.parse(atob(savedValue)); // Decode and parse the data
    } catch (e) {
      console.error("Failed to decode state from sessionStorage", e);
      return defaultValue;
    }
  }
  return defaultValue;
};

const syncWithSessionStorageEffect =
  (key) =>
  ({ setSelf, onSet }) => {
    const initialState = getInitialState(key, {
      e_mail: "",
      password: "",
      bname: "",
      blocation: "",
    });

    setSelf(initialState);

    onSet((newValue, _, isReset) => {
      if (isReset || newValue instanceof DefaultValue) {
        sessionStorage.removeItem(key);
      } else {
        try {
          sessionStorage.setItem(key, btoa(JSON.stringify(newValue))); // Encode and store the data
        } catch (e) {
          console.error("Failed to encode state for sessionStorage", e);
        }
      }
    });
  };

const registerUser = atom({
  key: "registerUser",
  default: {
    e_mail: "",
    password: "",
    bname: "",
    blocation: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    phone1: "",
    websitelink: "",
    createdby: "",
  },
  effects: [syncWithSessionStorageEffect("registerUser")],
});

export default registerUser;
