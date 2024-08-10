import { userActions } from "../slice/userSlice";

const login = () => (dispatch) => {
    console.log('disp',dispatch)
    dispatch(userActions.login());

}
const resgister = () => (dispatch) => {
    console.log('disp',dispatch)
    dispatch(userActions.resgister());
}
export { login, resgister }