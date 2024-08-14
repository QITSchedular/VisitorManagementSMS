import React, { useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import "./breadcrumbs.scss";

const findRoute = (routes, path) => {
  return routes ? routes.find((route) => route.path === path) : null;
};

const Breadcrumbs = ({ routes, navigation }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const prevLocationRef = useRef();

  useEffect(() => {}, [location]);

  if (!location.pathname) {
    return null;
  }

  const pathSegments = location.pathname.split("/").filter(Boolean);

  const breadcrumbItems = pathSegments.map((segment, index) => {
    const currentPath = `/${pathSegments.slice(0, index + 1).join("/")}`;
    const route = findRoute(routes, currentPath);

    if (!route) {
      return {
        label: segment,
        link: currentPath,
        isLast: index === pathSegments.length - 1,
      };
    }

    const currentLabel =
      index === pathSegments.length - 1 ? segment : route.element.displayName;

    return {
      label: currentLabel,
      link: currentPath,
      isLast: index === pathSegments.length - 1,
    };
  });
  function findMatchingText(path, navigation) {
    function search(items, path) {
      if (!Array.isArray(items)) {
        return null; // Handle non-iterable items
      }
      for (const item of items) {
        if (item.path === path) {
          return item;
        } else if (item.items) {
          const subItemText = search(item.items, path);
          if (subItemText) {
            return subItemText;
          }
        }
      }
      return null;
    }

    return search(navigation, path);
  }
  return (
    <div className="content-block breadcrumbs">
      <>
        {breadcrumbItems.map((pathSegment, key) => {
          const isLastChild = pathSegment.isLast;
          const className = `breadcrumb-item ${
            isLastChild ? "last-child" : ""
          }`;

          if (pathSegment && (pathSegment !== null || pathSegment !== "")) {
            const text = findMatchingText(pathSegment.link, navigation);
            if (text !== null) {
              return (
                <Link
                  key={key}
                  to={text.path}
                  style={{ textDecoration: "none" }}
                >
                  <div key={key} className={className}>
                    <span className="breadcrumb-item-text">{text.text}</span>
                    {isLastChild ? null : (
                      <span className="breadcrumb-slash">/</span>
                    )}
                  </div>
                </Link>
              );
            } else {
              return (
                <Link
                  key={key}
                  style={{ textDecoration: "none" }}
                  to={pathSegment.link}
                >
                  <div key={key} className={className}>
                    <span className="breadcrumb-item-text">
                      {pathSegment.label}
                    </span>
                    {isLastChild ? null : (
                      <span className="breadcrumb-slash">/</span>
                    )}
                  </div>
                </Link>
              );
            }
          } else {
            return (
              <Link key={key} to="/home">
                <div className="breadcrumb-item breadcrumb-home">Home</div>
              </Link>
            );
          }
        })}
      </>
    </div>
  );
};

export default Breadcrumbs;
