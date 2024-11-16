import { atom, DefaultValue } from "recoil";

const getInitialState = (key, defaultValue) => {
  const savedValue = sessionStorage.getItem(key);
  if (savedValue !== null) {
    try {
      return JSON.parse(atob(savedValue)); // Decode and parse the data
    } catch (e) {
      // console.error("Failed to decode state from sessionStorage", e);
      return defaultValue;
    }
  }
  return defaultValue;
};

const syncWithSessionStorageEffect =
  (key) =>
  ({ setSelf, onSet }) => {
    const initialState = getInitialState(key, {
      vavatar: "",
      cnctperson: "",
      department_id: "",
      timeslot: "",
      anyhardware: "",
      purposeofvisit: "",
      company_id: "",
      reason: "",
      status: "",
      createdby: null, // or send user id
      vname: "",
      phone1: "",
      vcmpname: "",
      vlocation: "",
      e_mail: "",
    });

    setSelf(initialState);

    onSet((newValue, _, isReset) => {
      if (isReset || newValue instanceof DefaultValue) {
        sessionStorage.removeItem(key);
      } else {
        try {
          sessionStorage.setItem(key, btoa(JSON.stringify(newValue))); // Encode and store the data
        } catch (e) {
          // console.error("Failed to encode state for sessionStorage", e);
        }
      }
    });
  };

const registerVisitor = atom({
  key: "registerVisitor",
  default: {
    vavatar: "",
    cnctperson: "",
    department_id: "",
    timeslot: "",
    anyhardware: "",
    purposeofvisit: "",
    company_id: "",
    reason: "",
    status: "",
    createdby: null, // or send user id
    vname: "",
    phone1: "",
    vcmpname: "",
    vlocation: "",
    e_mail: "",
    isidentity: "",
  },
  effects: [syncWithSessionStorageEffect("registerVisitor")],
});

export default registerVisitor;
