import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface UserState {
  phoneNumber: number | undefined;
  username: string | undefined;
  password: string | undefined;
}

const initialState: UserState = {
  phoneNumber: undefined,
  username: "",
  password: "",
};

export interface UserDetails {
  username: string | undefined;
  phoneNumber: number | undefined;
  password: string | undefined;
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state: any, action: PayloadAction<UserDetails>) => {
      const { payload } = action;
      state.username = payload.username;
      state.phoneNumber = payload.phoneNumber;
      state.password = payload.password;
    },
  },
});

export const { setUser } = userSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.user.phoneNumber)`
export const selectUsername = (state: RootState) => state.user?.username;
export const selectPhoneNumber = (state: RootState) => state.user?.phoneNumber;
export const selectPassword = (state: RootState) => state.user?.password;

export default userSlice.reducer;
