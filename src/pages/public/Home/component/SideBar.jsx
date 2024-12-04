import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink } from "react-router-dom"
function SideBar() {
 // const disPatch = useDispatch()
  // const productCategory = useSelector(state => state.productCategory)
  // useEffect(() => {
  //   disPatch(fetchProductCategory())
  // }, [])
  return (
    <div className=""></div>
    // <div className='w-[25%] border shadow-md'>
    //   {
    //     productCategory.categories.map(category => (
    //       <NavLink key={category._id} className={({ isActive }) => {
    //         const style = isActive ? 'text-main' : 'hover:text-main'
    //         return style + ' px-5 py-[15px] flex items-center'
    //       }} to={`${category.slug}?category=${category.slug}`}>
    //         <div className="w-5 h-5">
    //           <img src={category.icon} alt={category.title} />
    //         </div>
    //         <span className="block ml-2">{category.title}</span>
    //       </NavLink>
    //     ))
    //   }
    // </div>
  )
}

export default SideBar