import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Form from "./components/Form/Form";

const Routes = () => {
    return (
        <Switch>
            <Route exact path="/" component={Form} />
        </Switch>
    )
}

export default Routes