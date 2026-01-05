import { useSelector } from "react-redux";

export const useTheme = () => {
  const theme = useSelector((state) => state.theme);
  
  return {
    themeColor: theme.themeColor || "#0B4B31",
    secondaryColor: theme.secondaryColor || "#13574A",
    logo: theme.logo || "",
    favicon: theme.favicon || "",
    mainText: theme.mainText || "MaktabOS",
  };
};



