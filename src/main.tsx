import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App.tsx";
import { createAppQueryClient } from "./core/query/createAppQueryClient";
import { store } from "./store/store";

const rootElement = document.getElementById("root");
const queryClient = createAppQueryClient();

if (rootElement) {
	const root = createRoot(rootElement);
	root.render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<Provider store={store}>
					<App />
				</Provider>
			</QueryClientProvider>
		</StrictMode>,
	);
} else {
	throw new Error("Root element not found");
}
