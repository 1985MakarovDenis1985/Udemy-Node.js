import React from 'react'

function Form({next, prev}) {
    const inputName = React.createRef()

    const agePlus = (e) => {
        e.preventDefault()
        next()
    }

    const ageMinus = (e) => {
        e.preventDefault()
        prev()
        console.log(inputName.current)
    }


    return (
        <div className="temp_form_container">
            <form className="temp_form_block">
                <img className="temp_img" src="" alt=""/>
                <input type="file" placeholder="file" name="file" ref={inputName}/>
                <input type="text" placeholder="name" name="name"/>
                <input type="text" placeholder="email" name="email"/>
                <input type="text" placeholder="password" name="password"/>
                <div className="temp_btn_block">
                    <button onClick={agePlus} id="temp_btn_add">ADD</button>
                    <button onClick={ageMinus} id="temp_btn_remove">REMOVE</button>
                    <button id="temp_btn_change">CHANGE</button>
                </div>
            </form>
        </div>
    );
}

export default Form;
