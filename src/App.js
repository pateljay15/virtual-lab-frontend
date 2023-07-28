import './App.css';
import { BrowserRouter , Routes, Route} from "react-router-dom"
import Home from './pages/Home';
import EditorPage from './pages/EditorPage';
import { Toaster } from 'react-hot-toast';
import RunPage from './pages/RunPage';


function App() {
  return (
    <>
      <div>
        <Toaster 
        position='top-right' 
        toastOptions={{
          success: {
            theme: {
              primary: "#4aed88"
            }
          }
        }}></Toaster>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/editor/:roomId/:role/:mainname' element={<EditorPage/>}></Route>
          <Route path='/run/:lang' element={<RunPage/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
