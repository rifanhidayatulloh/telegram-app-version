const initialState = {
  data: [],
  isLoading: false,
  isError: false
};

const getAllUser = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ALL_USER_PENDING':
      return { ...state, isLoading: true };
    case 'GET_ALL_USER_FULFILLED':
      return {
        ...state,
        isLoading: false,
        data: action.payload.data.data
      };
    case 'GET_ALL_USER_REJECTED':
      return { ...state, isLoading: false, isError: true };
    default:
      return state;
  }
};

export default getAllUser;
