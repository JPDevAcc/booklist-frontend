import axios from "axios";

const CONTENT_JSON_HEADER = {
	headers: {
		'content-type': 'application/json'
	}
} ;

// const API_SERVER = 'http://localhost' ;
// const API_PORT = 3005 ;
const API_SERVER = 'https://jpdev-booklist-api.onrender.com' ;
const API_PORT = '' ;
const API_ROOT = '' ;

const API_URL = API_SERVER + ':' + API_PORT + API_ROOT ;

const API_COUNT = API_URL + '/booklist/count' ;
const API_RETRIEVE = API_URL + '/booklist' ;
const API_REMOVE = API_URL + '/delete' ;
const API_ADD = API_URL + '/create' ;
const API_UPDATE = API_URL + '/booklist' ;
const API_RETRIEVE_RANGE = API_URL + '/booklist/range' ;
const API_RETRIEVE_SEARCH_RANGE = API_URL + '/booklist/search' ;

const API_SETISREAD = API_URL + '/booklist/isread' ;

export default class BookService {
	constructor(errHandler = null) {
		this.errHandler = errHandler ;
	}

	errHandlerInternal(err) {
		if (this.errHandler) this.errHandler(err.message) ;
		else console.error(err) ;
		throw(err) ; // (rethrow)
	}

	getCount() {
		return axios.get(API_COUNT).then(this.errHandler(null)).catch((err) => this.errHandlerInternal(err)) ;
	}

	retrieveAll() {
		return axios.get(API_RETRIEVE).then(this.errHandler(null)).catch((err) => this.errHandlerInternal(err)) ;
	}

	retrieveRange(indexStart, indexEnd) {
		return axios.get(API_RETRIEVE_RANGE + '/' + indexStart + '/' + indexEnd).then(this.errHandler(null)).catch((err) => this.errHandlerInternal(err)) ;
	}

	retrieveRangeByCriteria(indexStart, indexEnd, criteriaList) {
		/* Search criteria format: f1=fieldName1&s1=searchValue1&f2=fieldName2&s2=searchValue2... */
		let argsStr = '' ;
		for (const [i, criteria] of criteriaList.entries()) {
			argsStr += ('&f' + i + '=') + encodeURI(criteria.fieldName) + ('&s' + i + '=') + encodeURI(criteria.searchValue.trim()) ;
		}
		return axios.get(API_RETRIEVE_SEARCH_RANGE + '/and?' + argsStr).then(this.errHandler(null)).catch((err) => this.errHandlerInternal(err)) ;
	}

	removeBook(id) {
		return axios.delete(API_REMOVE + '/' + id).then(this.errHandler(null)).catch((err) => this.errHandlerInternal(err)) ;
	}

	addBook(data) {
		this._trimObjFields(data) ;
		return axios.post(API_ADD, data, CONTENT_JSON_HEADER).then(this.errHandler(null)).catch((err) => this.errHandlerInternal(err)) ;
	}

	updateBook(id, data) {
		this._trimObjFields(data) ;
		return axios.put(API_UPDATE + '/' + id, data, CONTENT_JSON_HEADER).catch((err) => this.errHandlerInternal(err)) ;
	}

	setIsReadStatus(id, isRead) {
		return axios.patch(API_SETISREAD + '/' + id, {read: isRead}, CONTENT_JSON_HEADER).then(this.errHandler(null)).catch((err) => this.errHandlerInternal(err)) ;
	}

	_trimObjFields(obj) {
		for (const key of Object.keys(obj)) {
			obj[key] = obj[key].trim() ;
		}
	}
}