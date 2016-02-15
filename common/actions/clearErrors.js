export const CLEAR_ERRORS = 'CLEAR_ERRORS'

function clearErrors() {
  return {type: CLEAR_ERRORS}
}

export default function clearErrorsAction() {
  return dispatch => {
    dispatch(clearErrors())
  }
}
