import React from "react";

const Followers = React.lazy(() => import("../pages/followers/Followers"));
const Home = React.lazy(() => import("../pages/home/Home"));
const TweetPage = React.lazy(() => import("../pages/tweet_page/TweetPage"));
const Profile = React.lazy(() => import("../pages/profile/Profile"));
const Bookmarks = React.lazy(() => import("../pages/bookmarks/Bookmarks"));
const Error = React.lazy(() => import("../pages/error/Error"));

const routes = [
    {
        path: "/",
        element: Home
    },
    {
        path: "/bookmarks",
        element: Bookmarks
    },
    {
        path: "/tweet/:id",
        element: TweetPage
    },
    {
        path: "/profile/:id",
        element: Profile
    },
    {
        path: "/profile/:id/follows",
        element: Followers
    },
    {
        path: "error",
        element: Error
    }
];

export default routes;