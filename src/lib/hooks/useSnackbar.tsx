import { Alert, AlertColor, Snackbar } from "@mui/material";
import { createContext, FC, useContext, useEffect, useState } from "react";

export const SnackbarContext = createContext({
  snackbar: {
    show: (message: string, severity?: AlertColor) => {},
  },
});

export function useSnackbar() {
  const context = useContext(SnackbarContext);

  if (context === undefined) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }

  return context;
}

export const SnackbarContextProvider: FC = ({ children }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor | undefined>("info");

  const handleShowSnackbar = (message: string, severity?: AlertColor) => {
    setSnackbarMessage(message);
    if (severity) {
      setSeverity(severity);
    }
    setSnackbarOpen(true);
  };

  useEffect(() => {
    if (snackbarOpen) {
      setTimeout(() => {
        setSnackbarOpen(false);
      }, 5000);
    }
  }, [snackbarOpen]);

  const provider = {
    snackbar: {
      show: handleShowSnackbar,
    },
  };

  return (
    <SnackbarContext.Provider value={provider}>
      {children}
      <Snackbar open={snackbarOpen} autoHideDuration={500}>
        <Alert severity={severity}>{snackbarMessage}</Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
