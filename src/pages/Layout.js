import Header from './Header'
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

    </div>
  );

}
export default Layout;