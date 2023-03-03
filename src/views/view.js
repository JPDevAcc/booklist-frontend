import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../contexts/User"

const booksPerPage = 10 ;

export default function View({ bookService, changeBookDataToModify }) {
	const [ state, dispatch ] = React.useContext(UserContext) ;

const [searchTitle, changeSearchTitle] = useState('') ;
const [searchAuthor, changeSearchAuthor] = useState('') ;

	const [bookData, changeBookData] = useState(null) ;
	const [numBooks, changeNumBooks] = useState(null) ;
	const [pageNum, changePageNum] = useState(0) ;

	function handleSearchTitleChange(e) {
		changePageNum(0) ;
		getBooks(booksPerPage * pageNum, booksPerPage * (pageNum + 1), e.target.value, searchAuthor) ;
		changeSearchTitle(e.target.value) ;
	}

	function handleSearchAuthorChange(e) {
		changePageNum(0) ;
		getBooks(booksPerPage * pageNum, booksPerPage * (pageNum + 1), searchTitle, e.target.value) ;
		changeSearchAuthor(e.target.value) ;
	}

	function getBooks(indexStart, indexEnd, title, author) {
		const criteriaList = [] ;
		if (title) criteriaList.push({fieldName: 'title', searchValue: title}) ;
		if (author) criteriaList.push({fieldName: 'author', searchValue: author}) ;
		if (criteriaList.length > 0) {
			bookService.retrieveRangeByCriteria(indexStart, indexEnd, criteriaList).then(({data}) => {
				changeBookData(data) ;
			}).catch((err) => console.log(err)) ;
		}
		else {
			retrieveBooks(indexStart, indexEnd) ;
			getNumBooks() ;
		}
	}

	const navigate = useNavigate();

	useEffect(() => {
		dispatch({ type: "remove"}) ;
	}, []) ;

	useEffect(() => {
		getNumBooks() ;
		retrieveBooks(0, booksPerPage) ;
	}, []) ;

	function getNumBooks() {
		bookService.getCount().then(({data}) => {
			changeNumBooks(data.count) ;
		}).catch((err) => console.log(err)) ;
	}

	function retrieveBooks(indexStart, indexEnd) {
		return bookService.retrieveRange(indexStart, indexEnd).then(({data}) => {
			console.log(data) ;
			changeBookData(data) ;
		}).catch((err) => console.log(err)) ;
	}

	function toggleRead(id, isRead) {
		changeBookData(books => books.map(book => (book._id === id) ? {...book, read: isRead} : book))
		bookService.setIsReadStatus(id, isRead).catch(() => {
			changeBookData(books => books.map(book => (book._id === id) ? {...book, read: !isRead} : book))
		}) ;
	}

	function removeBook(id) {
		bookService.removeBook(id).then(() => {
			const newNumBooks = numBooks - 1 ;
			let newPageNum = pageNum ;
			if (booksPerPage * pageNum >= newNumBooks && pageNum > 0) {
				newPageNum-- ;
				changePageNum(pageNum => pageNum - 1) ;
			}
			if (!searchTitle && !searchAuthor) getNumBooks() ;
			getBooks(booksPerPage * newPageNum, booksPerPage * (newPageNum + 1), searchTitle, searchAuthor) ;
		}).catch((err) => console.log(err)) ;
	}

	function editBook(formData) {
		changeBookDataToModify(formData) ;
		navigate("/edit") ;
	}

	function handlePageChange(e) {
		const oldPageNum = pageNum ;
		const newPageNum = parseInt(e.target.value) ;
		changePageNum(newPageNum) ;
		getBooks(booksPerPage * newPageNum, booksPerPage * (newPageNum + 1), searchTitle, searchAuthor).catch(() => {
			changePageNum(oldPageNum) ;
		}) ;
	}

	function refresh() {
		if (!searchTitle && !searchAuthor) getNumBooks() ;
		getBooks(booksPerPage * pageNum, booksPerPage * (pageNum + 1), searchTitle, searchAuthor) ;
	}

	const buildRows = () => {
    return bookData?.map((book, i) => (
      <tr key={i}>
        <td>
          {book.title}
        </td>
        <td>
          {book.author}
        </td>
				 <td>
				 	<input type='checkbox' checked={book.read} onChange={(e) => toggleRead(book._id, e.target.checked)} />
        </td>
				<td>
					<button className="btn btn-secondary me-2" onClick={() => editBook(book)}>Edit</button>
				 	<button className="btn btn-danger" onClick={() => removeBook(book._id)}>Remove</button>
        </td>
      </tr>
    ))
  }

	const buildPageSelectOpts = () => {
		const numPages = Math.ceil(numBooks / booksPerPage) ;
		 return [...Array(numPages).keys()].map((i) => (
      <option value={i} key={i}>
				Page {i+1}
			</option>
    ))
	}
  
  return (
    <>
			{(!searchTitle && !searchAuthor) && <h1>Displaying books {booksPerPage * pageNum + 1} - {Math.min(booksPerPage * (pageNum + 1), numBooks)} (of {numBooks})</h1>}

			<div className="my-3">
				<input value={searchTitle} onChange={handleSearchTitleChange} placeholder="Title" className="me-3" />
				<input value={searchAuthor} onChange={handleSearchAuthorChange} placeholder="Author" />
			</div>

			<div className="my-3">
				<div className="row justify-content-center">
				{(!searchTitle && !searchAuthor) && 
					<div className="col-auto">
						<select className="form-control form-select" value={pageNum} onChange={handlePageChange} >
							{buildPageSelectOpts()}
						</select>
					</div>}
					<div className="col-auto">
						<button className="btn btn-primary" onClick={refresh}>Refresh</button>
					</div>
				</div>
				
			</div>

			<Table striped bordered hover>
				<thead>
					<tr>
						<th>Title</th>
						<th>Author</th>
						<th>Read</th>
					</tr>
				</thead>
				<tbody>
					{buildRows()}
				</tbody>
			</Table>
		</>
	);
}