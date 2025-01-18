import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { registerLicense } from "@syncfusion/ej2-base";
import { BrowserRouter as Router } from "react-router-dom";
import WindowContext from "./Context/WindowContext";
import MenuContext from "./Context/MenuContext";
import {SocketProvider} from "./Context/SocketContext.jsx";
import {NotificationProvider} from "./Context/NotificationContext.jsx";
import {DateProvider} from "./Context/DateContext.jsx";
import CurrentUserContext from "./Context/CurrentUserContext.jsx";
import {ToastProvider} from "./Context/ToastContext.jsx";

registerLicense(
"Ngo9BigBOggjHTQxAR8/V1NMaF5cXmBCfEx3Q3xbf1x1ZFdMZVRbR3JPIiBoS35Rc0ViWHhfdXRTR2BbVEB0"
);

const root = ReactDOM.createRoot(
  document.getElementById("root") 
);
root.render(
  <React.StrictMode>

    <DateProvider>
        <SocketProvider>
            <ToastProvider>
                <NotificationProvider>
                <WindowContext>
                    <MenuContext>
                        <CurrentUserContext>
                            <Router>
                                <App />
                            </Router>
                        </CurrentUserContext>
                    </MenuContext>
                </WindowContext>
            </NotificationProvider>
            </ToastProvider>
        </SocketProvider>
    </DateProvider>
  </React.StrictMode>
);
