const initialState = {
  data: [],
  isLoading: false,
  isError: false,
};

const getUserDetailId = (state = initialState, action) => {
  switch (action.type) {
    case "GET_USER_DETAIL_ID_PENDING":
      return { ...state, isLoading: true };
    case "GET_USER_DETAIL_ID_FULFILLED":
      return {
        ...state,
        isLoading: false,
        data: action.payload.data.data,
      };
    case "GET_USER_DETAIL_ID_REJECTED":
      return { ...state, isLoading: false, isError: true };
    default:
      return state;
  }
};

export default getUserDetailId;
