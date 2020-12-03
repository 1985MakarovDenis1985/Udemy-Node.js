import React, {Fragment} from 'react';
import {connect} from 'react-redux'
//----------------------------
import {nextSlide, prevSlide} from "../redux/actions/actions";
import Form from "./Form/Form";
import UsersList from "./UserList/UsersList";


const mapStateToProps = (state) => {
    return {
        state : state.testReducer
    }
}

const mapDispatchToProps = {
    nextSlide,
    prevSlide
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: []
        }
    }

    componentDidMount() {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(data => data.json())
            .then(data => this.setState({users: data}))
    }

    render() {
        return (
            <Fragment>
                <div></div>
                {/*{console.log(this.props.state)}*/}
                <Form next = {this.props.nextSlide} prev={this.props.prevSlide}/>
                <p>{this.props.state.age}</p>
                <UsersList users={this.state.users}/>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

