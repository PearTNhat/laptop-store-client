import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"


// eslint-disable-next-line react/display-name
export const withBaseComponent = (Component) => (props) =>{
    // ham này là muốn truyền gì thêm vào component thì truyền vào đây
    const dispatch = useDispatch()
    const navigate = useNavigate()
    return <Component {...props} dispatch={dispatch} navigate={navigate}/>
}

//withBaseComponent(Component)

// <Component id='1' /> khi goi thì withBaseComponent(Component) sẻ active
// rồi return <Component id='1' dispatch={dispatch} navigate={navigate} />