import { useRecoilState } from "recoil";
import registerUser from "./createUserAtom";
import registerVisitor from "./mobileVisitorUser";

export const useRegisterState = () => useRecoilState(registerUser);
export const useRegisterVisitor = () => useRecoilState(registerVisitor);
// export const useRegisterVisitor = () => useRecoilState(registerVisitor);

// import { useRecoilState } from "recoil";
// import registerUser from "./createUserAtom";
// import registerVisitor from "./mobileVisitorUser";

// export const useRegisterState = () => useRecoilState(registerUser);
// export const useRegisterVisitor = () => useRecoilState(registerVisitor);
