import App from "../App";
import Home from "../pages/Home";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";

const { createBrowserRouter } = require("react-router-dom");

const router = createBrowserRouter(
    [{
        path: '/',
        element: <App />
    },
        {
            path: 'signup',
            element:<SignUp/>
        },
        {
            path: "home",
            element:<Home/>
        },
        {
            path: "login",
            element:<Login/>
        }


    ]
)
export default router;