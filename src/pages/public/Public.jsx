import { Outlet } from 'react-router-dom'
import Footer from '~/sections/Footer'
import Header from '~/sections/Header'
import Navigation from '~/sections/Navigation'
import Topbar from '~/sections/Topbar'
// trang này sẽ hiển thị khi người dùng chưa đăng nhập
function Public() {
  return (
    <div className=''>
      <Topbar/>
      <Header/>
      <Navigation/>
      <Outlet/>
      <Footer/>
    </div>
   
  )
}

export default Public