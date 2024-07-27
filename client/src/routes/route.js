import App from "../App";
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
        }

    ]
)
export default router;