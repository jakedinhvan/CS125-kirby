import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import AnimePage from "./pages/AnimePage";
import AppLayout from "./AppLayout";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/browse", element: <Browse /> },
      { path: "/search", element: <Search /> },
      { path: "/profile", element: <Profile /> },
      {
        path: "/anime/:id",
        loader: async ({ params }) => {
          const res = await fetch(`/api/kirby/${params.id}`);
          return res.json();
        },
        element: <AnimePage />,
      },
    ],
  }
])