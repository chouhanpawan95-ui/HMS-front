import Header from './Header'
import Footer from './Footer'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'


const Layout = () => {

  return(
    <div className='layout'>
      <Header/>
      <Sidebar/>

      <div className='content' style={{ marginTop: '73px' }}>
        <Outlet/>
      </div>

      <Footer/>

    </div>
  );

}
export default Layout;