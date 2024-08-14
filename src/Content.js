import { Routes, Route, Navigate } from "react-router-dom";
import appInfo from "./app-info";
import routes from "./app-routes";
import { SideNavInnerToolbar as SideNavBarLayout } from "./layouts";
import { Footer } from "./components";
import { useAuth } from "./contexts/auth";
import { useEffect, useState } from "react";

export default function Content() {
  const { authRuleContext, user } = useAuth();

  const [userRoutes, setUserRoutes] = useState([]);
  function extractPaths(data) {
    const paths = [];

    for (const item of data) {
      paths.push(item.path);

      if (item.items) {
        paths.push(...extractPaths(item.items));
      }
    }

    return paths;
  }
  const storedData = sessionStorage.getItem("prevPath");
  useEffect(() => {
    const paths = extractPaths(authRuleContext);

    const filteredObjects = routes.filter((obj) => {
      return paths.some((path) => obj.path.includes(path));
    });
    setUserRoutes(filteredObjects);
  }, [authRuleContext]);
  return (
    <SideNavBarLayout title={appInfo.title}>
      <Routes>
        {userRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
        {user?.userrole == "MA" ? (
          <>
            <Route
              path="*"
              element={<Navigate to={storedData || "/Company"} />}
            />
          </>
        ) : (
          <>
            <Route
              path="*"
              element={<Navigate to={storedData || "/Visitors"} />}
            />
          </>
        )}
      </Routes>
      <Footer>
        Copyright © {new Date().getFullYear()}-{new Date().getFullYear() + 1}{" "}
        Quantum It Solution
      </Footer>
    </SideNavBarLayout>
  );
}
