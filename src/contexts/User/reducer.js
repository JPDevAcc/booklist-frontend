export const reducer = (state, action) => {
  switch (action.type) {
    case "setmsg":
      return {
        ...state,
        msg: action.msg,
				type: 'msg'
      }
		case "seterr":
      return {
        ...state,
        msg: action.msg,
				type: 'err'
      }
		case "remove":
			return {
				...state,
				msg: null,
				type: null
			}
    default:
      return state
  }
}

export const initialState = {
  msg: null,
	type: null
}