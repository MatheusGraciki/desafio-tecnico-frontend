import type { ComponentType } from "react";
import { Box } from "@mui/material";
import { Outlet, RouteObject, useRoutes } from "react-router-dom";
import { AppHeader } from "@/components/views/AppHeader";

const modules = import.meta.glob<{
  default: ComponentType;
}>("./**/index.tsx", { eager: true });

interface PageRoute {
  routeKey: string;
  component: ComponentType;
}

function buildPageRoutes(): PageRoute[] {
  const pages: PageRoute[] = [];

  for (const key in modules) {
    const normalizedKey = key
      .replace("./", "")
      .replace("/index.tsx", "")
      .toLowerCase();

    pages.push({
      routeKey: normalizedKey,
      component: modules[key].default,
    });
  }

  return pages;
}

function AppLayout() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AppHeader />
      <Box
        component="main"
        sx={{
          flex: 1,
          px: { xs: 0.5, sm: 0.75, lg: 1 },
          py: { xs: 0.5, sm: 0.75 },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export function AppRoutes() {
  const pages = buildPageRoutes();

  const indexPage = pages.find((page) => page.routeKey === "index");
  const notFoundPage = pages.find((page) => page.routeKey === "notfound");

  const children: RouteObject[] = pages
    .filter((page) => !["index", "notfound"].includes(page.routeKey))
    .map((page) => ({
      path: page.routeKey,
      element: <page.component />,
    }));

  if (indexPage) {
    children.unshift({ path: "", element: <indexPage.component /> });
  }

  if (notFoundPage) {
    children.push({ path: "*", element: <notFoundPage.component /> });
  }

  const routes: RouteObject[] = [
    {
      path: "/",
      element: <AppLayout />,
      children,
    },
  ];

  return useRoutes(routes);
}
