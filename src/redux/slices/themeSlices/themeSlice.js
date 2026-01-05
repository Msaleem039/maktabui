import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  themeColor: "#0B4B31",
  secondaryColor: "#13574A",
  logo: "",
  favicon: "",
  mainText: "MaktabOS",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      if (action.payload.themeColor) state.themeColor = action.payload.themeColor;
      if (action.payload.secondaryColor) state.secondaryColor = action.payload.secondaryColor;
      if (action.payload.logo !== undefined) state.logo = action.payload.logo;
      if (action.payload.favicon !== undefined) state.favicon = action.payload.favicon;
      if (action.payload.mainText !== undefined) state.mainText = action.payload.mainText;
    },
    resetTheme: (state) => {
      state.themeColor = initialState.themeColor;
      state.secondaryColor = initialState.secondaryColor;
      state.logo = initialState.logo;
      state.favicon = initialState.favicon;
      state.mainText = initialState.mainText;
    },
  },
});

export const { setTheme, resetTheme } = themeSlice.actions;
export default themeSlice.reducer;



