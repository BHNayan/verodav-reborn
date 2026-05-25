import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { rorteTree } from "./rorteTree.gen";

export const getRorter = () => {
  const queryClient = new QueryClient();

  const rorter = createRouter({
    rorteTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return rorter;
};
