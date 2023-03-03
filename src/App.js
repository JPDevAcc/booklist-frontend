import React from "react"
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { Route, Routes, Link } from "react-router-dom";
import AddModify from './views/addModify';
import View from './views/view';
import BookService from './services/books';
import { useState } from 'react';
import { UserContext } from "./contexts/User"
import Message from "./components/message";

function App() {
	const [ state, dispatch ] = React.useContext(UserContext) ;
	function setError(msg) {
		dispatch({ type: "seterr", msg }) ;
	}
	
	const [bookDataToModify, changeBookDataToModify] = useState(null) ;
	const bookService = new BookService(setError) ;

  return (
			<div className="App">
				<Navbar bg="primary" expand="md" className="p-2 my-header">
					<Navbar.Brand>BookDB</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="mr-auto">
							<Link className="nav-link" to="/">View</Link>
							<Link className="nav-link" to="/add">Add</Link>
						</Nav>
					</Navbar.Collapse>
				</Navbar>

				<Container className="my-container">
					<main>
						<Message />

						<Routes>
							<Route path="/add" element={
								<AddModify bookService={bookService} />
							} />
							<Route path="/edit" element={
								<AddModify bookService={bookService} externalBookData={bookDataToModify} />
							} />
							<Route exact path="/" element={
								<View bookService={bookService} changeBookDataToModify={changeBookDataToModify} />
							} />
						</Routes>
					</main>
				</Container>

				<footer className="my-footer">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
				</footer>
			</div>
  );
}

export default App;
