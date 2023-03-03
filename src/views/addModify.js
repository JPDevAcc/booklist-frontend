import { useEffect, useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import React from "react"
import { UserContext } from "../contexts/User"

export default function Add({bookService, externalBookData}) {
	 const [ state, dispatch ] = React.useContext(UserContext) ;

	const [formData, changeFormData] = useState({
		title: externalBookData?.title || '',
		author: externalBookData?.author || ''
	}) ;

	useEffect(() => {
		dispatch({ type: "remove"}) ;
	}, []) ;

	useEffect(() => {
		const formDataObj = {
			title: externalBookData?.title || '',
			author: externalBookData?.author || ''
		} ;
		changeFormData(formDataObj) ;
	}, [externalBookData]) ;

	function handleChange(e) {
		changeFormData(formData => ({...formData, [e.target.name]: e.target.value.trim()})) ;
	}

	function addBook(formData) {
		if (externalBookData) {
			bookService.updateBook(externalBookData._id, formData).then(() => {
				dispatch({ type: "setmsg", msg:"Book updated" })
			}).catch(() => {}) ;
		}
		else {
			bookService.addBook(formData).then(() => {
				dispatch({ type: "setmsg", msg:"Book added" })
			}).catch(() => {}) ;
		}
	}

	function handleSubmit(e) {
		addBook(formData) ;
		e.preventDefault() ;
	}

	return (
		<>
		<h1>{externalBookData ? 'Edit Book' : 'Add Book'}</h1>
			<Form onSubmit={handleSubmit}>
				<Row>
					<Col md={5}>
						<Form.Control name="title" placeholder="Book Title" value={formData.title} onChange={handleChange} />
					</Col>
					<Col md={5}>
						<Form.Control name="author" placeholder="Book Author" value={formData.author} onChange={handleChange} />
					</Col>
					<Col md={2} className="m-auto">
						<Button variant="primary" type="submit" className="width100pc">{externalBookData ? 'Update' : 'Add'}</Button>
					</Col>
				</Row>
			</Form>
		</>
  );
}