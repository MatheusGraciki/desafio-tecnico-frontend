import { BrowserRouter } from "react-router-dom";
import { MuiAppThemeProvider } from "@/contexts/MuiAppThemeProvider";
import { AppRoutes } from "@/app/routes";

const App = () => (
	<MuiAppThemeProvider>
		<BrowserRouter>
			<AppRoutes />
		</BrowserRouter>
	</MuiAppThemeProvider>
);

export default App;
