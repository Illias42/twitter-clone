import React, {StrictMode, Suspense} from 'react';
import {Route, Routes} from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import routes from "./constants/routes";
import TwitterIcon from "@material-ui/icons/Twitter";
import {StylesProvider} from "@material-ui/core/styles";
import "./index.css";

const SignIn = React.lazy(() => import("./pages/auth/SignIn"));
const Layout = React.lazy(() => import("./pages/layout/Layout"));

function App() {
    return (
        <StrictMode>
            <div className="App">
                <StylesProvider injectFirst>
                    {/*<ErrorBoundary>*/}
                    <CssBaseline/>
                    <Suspense fallback={<TwitterIcon className="loader" color="primary"/>}>
                            <Routes>
                                <Route path="/signin" element={<SignIn/>}/>
                                <Route path="/" element={<Layout/>}>
                                    {routes.map((route) => (
                                        <Route path={route.path} element={<route.element/>}/>
                                    ))}
                                </Route>
                            </Routes>
                    </Suspense>
                    {/*</ErrorBoundary>*/}
                </StylesProvider>
            </div>
        </StrictMode>
    )
        ;
}

export default App;
