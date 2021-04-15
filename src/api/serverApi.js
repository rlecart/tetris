import { Redirect } from "react-router-dom";

function redirectTo(path) {
    {console.log('hahaha')}
    <Redirect push to={path}/>
}

export { redirectTo }