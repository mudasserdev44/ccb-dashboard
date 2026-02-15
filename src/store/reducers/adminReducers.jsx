const initialState = {
    isAuthenticated: false,
    token: null,
    user: null
}

const adminReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'LOGIN_SUCCESS': {
            return {
                ...state,
                token: action.payload.token,
                user: action.payload.user,
                isAuthenticated: true
            };
        }
        case 'UPDATE_USER_PROFILE': {
            return {
                ...state,
                user: action.payload
            };
        }
        case 'LOGOUT_SUUCCESS': {
            return {
                token: null,
                isAuthenticated: false,
                user: null
            };
        }
        default: return state;
    }
}

export default adminReducer;