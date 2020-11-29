import {NEXT_SLIDE, PREV_SLIDE} from "../types";


const initiallyState = {
    name: "Denys",
    age: 33
}

export const testReducer = (state = initiallyState, action) => {
    switch (action.type){
        case NEXT_SLIDE :
            return {...state, age: state.age + 1}
        case PREV_SLIDE :
            return {...state, age: state.age - 1}
        default :
            return state
    }
}

