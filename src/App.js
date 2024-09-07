import { useEffect } from "react";
import { ThemeProvider } from "styled-components";
import Toast from "components/General/Toast/Toast";
import theme from "themes";
import Routes from "./routes";
import useAuth from "./hooks/useAuth";
import "./App.css";

function App() {
  const { initUserSession } = useAuth();
  const { defaultColors, mediaQueries } = theme;
  const appTheme = {
    colors: defaultColors,
    mediaQueries,
  };

  useEffect(() => {
    initUserSession();
  }, []);

  return (
    <div className="App">
      <Toast />
      <ThemeProvider theme={appTheme}>
        <Routes />
      </ThemeProvider>
    </div>
  );
}

export default App;
