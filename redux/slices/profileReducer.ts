import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  SerializedError,
} from "@reduxjs/toolkit";
import { RootState } from "../store";

type Profile = {
  name: string;
  email: string;
  role: string; // Corrected the typo here
};

interface ProfileState {
  profile: Profile | null; // Changed this to a single profile object
  loading: boolean;
  error: string | null;
}

interface error {
  message: string;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};

export const fetchProfile = createAsyncThunk<
  Profile,
  void,
  { rejectValue: string }
>(
  "profile/fetchProfile", // Corrected the slice name here
  async (_, thunkAPI) => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/user/profile",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (response.ok) {
        return (await response.json()) as Profile;
      } else {
        return thunkAPI.rejectWithValue("Failed to fetch profile");
      }
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch profile");
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProfile.fulfilled,
        (state, action: PayloadAction<Profile>) => {
          state.loading = false;
          state.profile = action.payload;
        }
      )
      .addCase(
        fetchProfile.rejected,
        (
          state,
          action: PayloadAction<
            string | undefined,
            string,
            any,
            SerializedError
          >
        ) => {
          state.loading = false;
          state.error = action.payload || "Failed to fetch profile";
        }
      );
  },
});

export const selectProfile = (state: RootState) => state.profile.profile;

export default profileSlice.reducer;
