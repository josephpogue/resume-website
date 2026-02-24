import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Resume } from "./pages/Resume";
import { Missions } from "./pages/Missions";
import { Contact } from "./pages/Contact";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "resume", Component: Resume },
      { path: "missions", Component: Missions },
      { path: "contact", Component: Contact },
      {
        path: "*",
        Component: Home,
      },
    ],
  },
]);
