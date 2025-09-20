import { createContext, useState, useMemo } from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { themeSettings } from "../theme";

const ThemeContext = createContext();
const AdminContext = createContext();
const LoadingContext = createContext();

const GlobalProvider = ({ children }) => {
  const [mode, setMode] = useState("dark");
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const toggleColorMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const themeValue = useMemo(
    () => ({
      mode,
      toggleColorMode,
    }),
    [mode],
  );

  const createAdmin = (name, email, profile) => {
    setAdmin({
      name,
      email,
      profile,
    });
  };
  const deleteAdmin = () => {
    setAdmin(null);
  };

  const adminValue = useMemo(
    () => ({
      admin,
      createAdmin,
      deleteAdmin,
    }),
    [admin],
  );

  const startLoading = () => {
    setIsLoading(true);
  };
  const stopLoading = () => {
    setIsLoading(false);
  };
  const LoaderState = {
    isLoading,
    startLoading,
    stopLoading,
  };

  return (
    <ThemeContext.Provider value={themeValue}>
      <AdminContext.Provider value={adminValue}>
        <LoadingContext.Provider value={LoaderState}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </LoadingContext.Provider>
      </AdminContext.Provider>
    </ThemeContext.Provider>
  );
};

export { GlobalProvider, ThemeContext, AdminContext, LoadingContext };
