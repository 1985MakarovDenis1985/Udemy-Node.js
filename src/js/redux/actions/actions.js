import {
    NEXT_SLIDE,
    PREV_SLIDE
} from "../types"

export function nextSlide() {
    return {
        type: NEXT_SLIDE,
    }
}

export function prevSlide() {
    return {
        type: PREV_SLIDE,
    }
}

