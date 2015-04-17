import React from "react";
import { Route, DefaultRoute, NotFoundRoute } from "react-router";

import Application  from "./routeHandlers/Application";
import SomePage     from "./routeHandlers/SomePage";
import ReadmePage   from "./routeHandlers/ReadmePage";
import TodoPage     from "./routeHandlers/TodoPage";
import TodoListPage from "./routeHandlers/TodoListPage";
import TodoItemPage from "./routeHandlers/TodoItemPage";
import HomePage     from "./routeHandlers/HomePage";
import NotFoundPage from "./routeHandlers/NotFoundPage";


// polyfill
if(!Object.assign)
	Object.assign = React.__spread;

// export routes
module.exports = (
	<Route name="app" path="/" handler={Application}>
		<Route name="some-page" path="/some-page" handler={SomePage} />
		<Route name="readme" path="/readme" handler={ReadmePage} />
		<Route name="todo" path="/todo" handler={TodoPage} >
			<Route name="todolist" path="list/:list" handler={TodoListPage} />
			<Route name="todoitem" path="item/:item" handler={TodoItemPage} />
		</Route>
		<Route name="home" path="/home" handler={HomePage} />
		<DefaultRoute handler={HomePage} />
		<NotFoundRoute handler={NotFoundPage} />
	</Route>
);
