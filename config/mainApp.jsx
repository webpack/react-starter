import routes from "../app/mainRoutes";
import stores from "../app/mainStores";
import renderApplication from "./renderApplication";

renderApplication(routes, stores, {
	timeout: 600
});
