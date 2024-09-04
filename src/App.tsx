import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { DisplayGraph } from './features/graphview/view';
import { ArchiveView } from './features/archiveview/view';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <Box width="100vw" minHeight="100vh" sx={{ display: 'flex', flexFlow: 'column' }}>
      {/*<ThemeProvider theme={darkTheme}>*/}
        <CssBaseline />
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<DisplayGraph/>} />
          <Route path="/clueweb12/:pageid" Component={ArchiveView} />
          </Routes>
        </BrowserRouter>
      {/*</ThemeProvider>*/}
    </Box>
  );
}

export default App;
