import { createSlice } from "@reduxjs/toolkit";

// Load theme from localStorage on initialization
const loadThemeFromStorage = () => {
  if (typeof window === "undefined") {
    return {
      themeColor: "#0B4B31",
      secondaryColor: "#13574A",
      logo: "",
      favicon: "",
      mainText: "MaktabOS",
    };
  }

  try {
    const storedTheme = localStorage.getItem("maktabTheme");
    if (storedTheme) {
      const parsedTheme = JSON.parse(storedTheme);
      return {
        themeColor: parsedTheme.themeColor || "#0B4B31",
        secondaryColor: parsedTheme.secondaryColor || "#13574A",
        logo: parsedTheme.logo || "",
        favicon: parsedTheme.favicon || "",
        mainText: parsedTheme.mainText || "MaktabOS",
      };
    }
  } catch (error) {
    console.error("Error loading theme from localStorage:", error);
  }

  return {
    themeColor: "#0B4B31",
    secondaryColor: "#13574A",
    logo: "",
    favicon: "",
    mainText: "MaktabOS",
  };
};

const initialState = loadThemeFromStorage();

// Save theme to localStorage
const saveThemeToStorage = (theme) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("maktabTheme", JSON.stringify(theme));
    } catch (error) {
      console.error("Error saving theme to localStorage:", error);
    }
  }
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
      
      // Save to localStorage whenever theme is updated
      saveThemeToStorage({
        themeColor: state.themeColor,
        secondaryColor: state.secondaryColor,
        logo: state.logo,
        favicon: state.favicon,
        mainText: state.mainText,
      });
    },
    resetTheme: (state) => {
      state.themeColor = "#0B4B31";
      state.secondaryColor = "#13574A";
      state.logo = "";
      state.favicon = "";
      state.mainText = "MaktabOS";
      
      // Clear from localStorage
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("maktabTheme");
        } catch (error) {
          console.error("Error removing theme from localStorage:", error);
        }
      }
    },
  },
});

export const { setTheme, resetTheme } = themeSlice.actions;
export default themeSlice.reducer;



