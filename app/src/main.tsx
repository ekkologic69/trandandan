import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { QueryClient, QueryClientProvider } from "react-query";
import "./index.css";
import { SWRConfig } from "swr";
import fetcher from "./utils/fetcher";
import { ChakraProvider } from "@chakra-ui/react";
import RequireAuth from "./components/routing-private";

const root = ReactDOM.createRoot(document.getElementById("root") as Element);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      staleTime: 5 * 1000,
    },
  },
});

root.render(
  <QueryClientProvider client={queryClient}>
    <SWRConfig
      value={{
        refreshInterval: 3000,
        fetcher: fetcher,
      }}
    >
      <ChakraProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ChakraProvider>
    </SWRConfig>
    {/* <ReactQueryDevtools initialIsOpen={false} /> */}
  </QueryClientProvider>,
);
