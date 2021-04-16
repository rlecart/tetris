import { Redirect } from "react-router-dom";

function redirectTo(path) {
    console.log(path)
    return <Redirect push to={path} />
}

export { redirectTo }