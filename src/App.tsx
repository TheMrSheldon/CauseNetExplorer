import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { DisplayGraph } from './features/graphview/view';


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    </*ThemeProvider theme={darkTheme}*/>
      <CssBaseline />
      <DisplayGraph/>
    </ /*ThemeProvider*/>
  );
}

export default App;
