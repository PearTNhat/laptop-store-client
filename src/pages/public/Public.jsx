import { Outlet } from 'react-router-dom'
import Footer from '~/sections/Footer'
import Header from '~/sections/Header'
import Navigation from '~/sections/Navigation'
import TopBar from '~/sections/TopBar'
// trang này sẽ hiển thị khi người dùng chưa đăng nhập
function Public() {
  return (
    <div className='relative'>
      <TopBar/>
      <Header/>
      <Navigation/>
      <Outlet/>
      <Footer/>
    </div>
   
  )
}

export default Public