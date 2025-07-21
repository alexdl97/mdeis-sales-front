import { createTheme } from "@mui/material/styles";

const muiTheme = createTheme({
  palette: {
    primary: {
      main: "#000000", // negro como color principal
      contrastText: "#FFFFFF", // texto blanco para botones
    },
  },
});

export default muiTheme;
