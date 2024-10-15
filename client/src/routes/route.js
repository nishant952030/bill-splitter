import App from "../App";
import ChatSection from "../pages/ChatSection";
import GroupChatSection from "../pages/GroupChatSection";
import Home from "../pages/Home";
import LandingPage from "../pages/Landing";
import Login from "../pages/Login";
import Profile from "../pages/shared/Profile";
import Sidebar from "../pages/Sidebar";
import SignUp from "../pages/SignUp";

const { createBrowserRouter } = require("react-router-dom");
const router = createBrowserRouter([
    {
        path: '/',
        element: <App />, // App will contain the Navbar and Outlet
        children: [
            {
                path: '/',
                element: <LandingPage />
            },
            {
                path: 'home',
                element: <Home />,
                children: [
                    {
                        path: 'user/:userId', // Nested route for user details
                        element: <ChatSection/> // Create this component
                    },
                    {
                        path: 'group/:groupId', 
                        element: <GroupChatSection/> 
                    }
                ]
            },
            {
                path: 'login',
                element: <Login />
            },
            {
                path: 'signup',
                element: <SignUp />
            },
            {
                path: 'profile',
                element: <Profile />
            }
        ]
    }
]);


export default router;
