import './SaudiAnimation.css';

function GifLogo() {
    return (   
      <div >
       
        <img src="../Maslakgif.gif" alt="Logo" style={{ width: '600px', height: 'auto', marginTop: '102px' }} />
        {/* <img src="../MaslakName.png" alt="Logo" style={{ width: '200px', height: 'auto', marginTop: '102px' }} /> */}
      </div>
    );
  }

function SaudiAnimation() {
    return (
      <div className='saudi-container' >
        <img className='saudi-animate' src="../SaudiLong.png" alt="Saudi Animation 1" />
        <img className='saudi-animate' src="../SaudiLong2.png" alt="Saudi Animation 2" />
        
      </div>
    );
  }

  export default SaudiAnimation;
  export {GifLogo};


