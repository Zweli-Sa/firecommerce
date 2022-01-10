const initialState = {
    cartItems: []
}

export const cartReducer = (state = initialState, action) => {

    switch (action.type) {

        case "ADD_TO_CART": {
            return {
                ...state,
                cartItems: [...state.cartItems, action.payload]
            }
        }

        case "DELETE_FROM_CART": {
            return {
                ...state,
                cartItems: state.cartItems.filter(obj => obj.id !== action.payload.id)
            }

        }
        case "DELETE_CART": {
            return {
                ...state,
                cartItems: state.cartItems.filter(x => x !== null)
            }
        }

        default: return state

    }

}