import { useRoutes } from "react-router-dom";
import PrivateRoute from "../utils/routes/PrivateRoute";
import PublicRoute from "../utils/routes/PublicRoute";
import AdminRoute from "../utils/routes/AdminRoute";
import { Login } from "../pages/Login";
import { Details } from "../pages/Details";
import { PageNotFound } from "../components/PageNotFound";
import UserManagement from "../pages/UserManagement";
import LandingPage from "../pages/LandingPage";
import { SetPassword } from "../pages/SetPassword";
import SearchResults from "../pages/SearchResults";
import useAuth from "../hooks/useAuth";
import ExportDownload from "../pages/ExportDownload";

export const Navigation = () => {
  useAuth();
  let routes = useRoutes([
    {
      path: "/",
      element: <PrivateRoute path={"/"} component={LandingPage} />,
      // element: <PublicRoute component={LandingPage} />
    },
    {
      path: "/user-management",
      element: (
        <AdminRoute path={"/user-management"} component={UserManagement} />
      ),
      // element: <PublicRoute component={UserManagement} />
    },{
      path: "/download",
      element: (
        <PrivateRoute path={"/download"} component={ExportDownload} />
      ),
    },
    {
      path: "/login",
      element: <PublicRoute component={Login} />,
    },
    {
      path: "/set-password/:new",
      element: <PublicRoute component={SetPassword} />,
    },
    {
      path: "/:tabName",
      element: <PrivateRoute component={SearchResults} />,
      // children: [
      //   {
      //     path: "",
      //     element: <PrivateRoute component={SearchResults} />,
      //   },
      //   {
      //     path: ":tabName",
      //     element: <PrivateRoute component={SearchResults} />,
          
      //   },
      // ],
      children: [
        {
          path: "?search=",
          element: <PrivateRoute component={SearchResults} />,
        },
        {
          path: ":uniqueId",
          element: <PrivateRoute component={SearchResults} />,
        }
      ]
    },
    {
      path: "/details",
      element: <Details />,
      children: [
        {
          path: "",
          element: <Details />,
        },
        {
          path: ":id",
          element: <Details />,
        },
      ],
    },
    {
      path: "*",
      element: <PageNotFound />,
    },
  ]);
  return routes;
};