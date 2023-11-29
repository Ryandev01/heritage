import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { SnackbarProvider } from "notistack";
import Slide, { SlideProps } from "@mui/material/Slide";
import "./App.css";
import "./variables.css";
import { Navigation } from "./navigation";
import FallbackComponent from "./components/Common/FallbackComponent";
import ErrorBoundary from "./components/ErrorBoundary";

// Redux setup
import { store } from "./store";
import { Provider } from "react-redux";
import SessionTimeOut from "./components/SessionTimeOut";

// apollo client
const client = new ApolloClient({
  uri: `${process.env.REACT_APP_STRAPI_GRAPHQL}`,
   cache: new InMemoryCache(),
});

const queryClient = new QueryClient();

type TransitionProps = Omit<SlideProps, "direction">;
function TransitionDown(props: TransitionProps) {
  return <Slide {...props} direction="down" />;
}

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ApolloProvider client={client}>
          <QueryClientProvider client={queryClient}>
            <SnackbarProvider
              maxSnack={4}
              hideIconVariant
              anchorOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              autoHideDuration={3000}
              TransitionComponent={TransitionDown}
            >
              <div className="App">
                <BrowserRouter>
                  <Suspense fallback={<FallbackComponent />}>
                    <Navigation />
                  </Suspense>
                </BrowserRouter>
                <SessionTimeOut/>
              </div>
            </SnackbarProvider>
          </QueryClientProvider>
        </ApolloProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
