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
      // Validate theme colors - ensure they're valid hex colors, not black or empty
      const themeColor = parsedTheme.themeColor && 
                         parsedTheme.themeColor !== "#000000" && 
                         parsedTheme.themeColor !== "black" &&
                         parsedTheme.themeColor.trim() !== "" 
                         ? parsedTheme.themeColor 
                         : "#0B4B31";
      
      const secondaryColor = parsedTheme.secondaryColor && 
                             parsedTheme.secondaryColor !== "#000000" && 
                             parsedTheme.secondaryColor !== "black" &&
                             parsedTheme.secondaryColor.trim() !== "" 
                             ? parsedTheme.secondaryColor 
                             : "#13574A";
      
      return {
        themeColor: themeColor,
        secondaryColor: secondaryColor,
        logo: parsedTheme.logo || "",
        favicon: parsedTheme.favicon || "",
        mainText: parsedTheme.mainText || "MaktabOS",
      };
    }
  } catch (error) {
    console.error("Error loading theme from localStorage:", error);
    // Clear invalid theme from localStorage
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("maktabTheme");
      } catch (e) {
        console.error("Error clearing invalid theme:", e);
      }
    }
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
      // Validate and set themeColor - reject black colors
      if (action.payload.themeColor !== undefined) {
        const newColor = action.payload.themeColor;
        if (newColor && newColor !== "#000000" && newColor !== "black" && newColor.trim() !== "") {
          state.themeColor = newColor;
        } else {
          state.themeColor = "#0B4B31";
        }
      }
      
      // Validate and set secondaryColor - reject black colors
      if (action.payload.secondaryColor !== undefined) {
        const newColor = action.payload.secondaryColor;
        if (newColor && newColor !== "#000000" && newColor !== "black" && newColor.trim() !== "") {
          state.secondaryColor = newColor;
        } else {
          state.secondaryColor = "#13574A";
        }
      }
      
      if (action.payload.logo !== undefined) state.logo = action.payload.logo;
      if (action.payload.favicon !== undefined) state.favicon = action.payload.favicon;
      if (action.payload.mainText !== undefined) state.mainText = action.payload.mainText;
      
      // Save to localStorage whenever theme is updated (only valid colors)
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



