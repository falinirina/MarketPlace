import { BrowserRouter, Route, Routes } from "react-router-dom";

import Connection from "./Pages/Connection";
import VerificationOTP from "./Pages/verificationOTP";
import Connected from "./Pages/Connected";
// import Navigation from "./Pages/Navigation";
import Connected2 from "./Pages/ConnectedMultip";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/">
                        <Route index element={<Connection />} />
                        <Route path="verificationOTP/:params" element={<VerificationOTP />} />
                        <Route path="connected" >
                            <Route index element={<Connected />} />
                            <Route path="multi" element={<Connected2 />} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
