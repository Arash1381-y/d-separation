import {Container} from "@mui/material";
import MainPage from "./MainPage";

function App() {
    return (
        <Container className="App"
                   sx={{minWidth: '100%', margin: 0, padding: 0, background: 'white', alignItems: 'center'}}>
            <MainPage/>
        </Container>
    );
}

export default App;
