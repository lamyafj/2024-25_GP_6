import './login.css';
import GreenContainer from '../../components/GreenContainer/GreenContainer';
import SaudiAnimation from '../../components/SaudiAnimation/SaudiAnimation';
import { GifLogo } from '../../components/SaudiAnimation/SaudiAnimation.js';


function Login() {
    return (
      <div>
        <div className='Login' >
          <GifLogo />
          <GreenContainer />
        </div > 
          <SaudiAnimation />
      </div>
    );
  }
  
  export default Login;
  