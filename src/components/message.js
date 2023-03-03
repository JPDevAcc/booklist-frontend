import { Alert } from 'react-bootstrap';
import React from "react"
import { UserContext } from "../contexts/User"

export default function Message() {
	const [ state, dispatch ] = React.useContext(UserContext) ;

	return (
		<>
		{(state.msg) ?
			<Alert className="py-0" variant={state.type === 'msg' ? 'success' : 'danger'} onClose={() => dispatch({ type: "remove" })} dismissible>
				<Alert.Heading>{state.type === 'msg' ? 'Success' : 'Error'}</Alert.Heading>
				<p>{state.msg}</p>
			</Alert> :
			<Alert className="invisible py-0">
				<Alert.Heading>&nbsp;</Alert.Heading>
				<p>&nbsp;</p>
			</Alert>
			}
		</>
	) ;
}