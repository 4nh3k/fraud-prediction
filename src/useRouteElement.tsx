import { useRoutes } from "react-router-dom";
import { path } from "./constants/path";

export default function useRouteElement() {
  const routeElement = useRoutes([
    {
      element: <div>home</div>,
      path: path.home,
    },
  ]);
  return routeElement;
}
