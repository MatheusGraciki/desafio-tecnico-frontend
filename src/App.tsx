import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/contexts/themeProvider";
import { AppRoutes } from "@/app/routes";

const App = () => (
	<ThemeProvider>
		<BrowserRouter>
			<AppRoutes />
		</BrowserRouter>
	</ThemeProvider>
);

export default App;
