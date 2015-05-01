import React from "react";
import { Route, DefaultRoute, NotFoundRoute } from "react-router";

/* eslint-disable no-multi-spaces */
// Only import from `route-handlers/*`
import Application  from "route-handlers/Application";
import SomePage     from "route-handlers/SomePage";
import ReadmePage   from "route-handlers/ReadmePage";
import TodoPage     from "route-handlers/TodoPage";
import TodoListPage from "route-handlers/TodoListPage";
import TodoItemPage from "route-handlers/TodoItemPage";
import HomePage     from "route-handlers/HomePage";
import NotFoundPage from "route-handlers/NotFoundPage";
import ChatPage     from "route-handlers/ChatPage";
/* eslint-enable */

// polyfill
if(!Object.assign)
	Object.assign = React.__spread; // eslint-disable-line no-underscore-dangle

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
		<Route name="chat" path="/chat/:room" handler={ChatPage} />
		<DefaultRoute handler={HomePage} />
		<NotFoundRoute handler={NotFoundPage} />
	</Route>
);
