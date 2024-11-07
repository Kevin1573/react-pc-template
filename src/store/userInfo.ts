import { create } from "zustand";

interface UserInfoStore {
  userInfo: UserInfoType | null;
  updateUserInfo: (userInfo: UserInfoType) => void;
  clearUserInfo: () => void;
}

export const useUserInfoStore = create<UserInfoStore>(set => ({
  userInfo: null,
  updateUserInfo: userInfo => set({ userInfo }),
  clearUserInfo: () => set({ userInfo: null }),
}));
