import { ThemeProvider } from '@mui/material';
import { useEffect, useState } from 'react';
import {
  Routes,
  Route,
  useNavigate,
  useSearchParams,
  Navigate,
} from 'react-router-dom';

import Auth from './components/Auth';
import Home from './components/Home';
import NFTMarketplace from './components/NFTMarketplace';
import theme from './utils/theme';
import foreverLoader from './assets/foreverLoader.gif';
import bgImg from './assets/auth-bg.png';
import { initializeSingularity } from 'singularity-init';

function App() {
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {

    let key;
    if (searchParams.get('key')) {
      console.log('using key through url');
      key = searchParams.get('key');
    } else if (localStorage.getItem('singularity-key')) {
      console.log('using key through localStorage');
      key = localStorage.getItem('singularity-key');
    } else {
      console.log('using default key value');
      key = 2; // default key
    }
    localStorage.setItem('singularity-key', key);

    initializeSingularity(window, document,'1.7.30-sandbox.1','production',key,async () => {
      console.log('----------singularity init callback--------')
      window.SingularityEvent.subscribe('SingularityEvent-logout', () => {
        console.log('logout event received')
        navigate('/');
        window.SingularityEvent.close()
      });

      window.SingularityEvent.subscribe('SingularityEvent-open', () =>
        setDrawerOpen(true)
      );

      window.SingularityEvent.subscribe('SingularityEvent-close', () => {
        console.log('subscribe close drawer ');
        setDrawerOpen(false);
      });

      window.SingularityEvent.subscribe(
        'SingularityEvent-onTransactionApproval',
        data => {
          console.log('Txn approved', JSON.parse(data));
        }
      );
      window.SingularityEvent.subscribe(
        'SingularityEvent-onTransactionSuccess',
        data => {
          console.log('Txn Successfull', JSON.parse(data));
        }
      );
      window.SingularityEvent.subscribe(
        'SingularityEvent-onTransactionFailure',
        data => {
          console.log('Txn failed', JSON.parse(data));
        }
      );

      window.SingularityEvent.subscribe('SingularityEvent-login', data => {
        console.log('login data --->', data);
        checkLoginAndAction()
      });

      setLoading(false);

      await checkLoginAndAction();
    });
  }, []);

  const checkLoginAndAction = async () => {
    console.log('before getting userData')
    const userData = await window.SingularityEvent.getConnectUserInfo()
    console.log('userData', userData)
    if(userData.metaData){
      navigate('/home');
    }

    window.SingularityEvent.close();
  }

  const handleGoogleSignInClick = () => {
    window.SingularityEvent.simulAction("[data-cy-attr='social-login-Google']", "click");
  }

  const renderCypressEle = () => {
    return <div onClick={handleGoogleSignInClick} style={{display: 'none'}} data-cy-attr="singularity-google-login"></div>
  }

  if (loading) return (
    <div
      style={{
        backgroundImage: `url(${bgImg})`,
        width: '100vw',
        height: '100vh',
        backgroundSize: '100% 100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >

      <div
        style={{
          backgroundImage: `url(${foreverLoader})`,
          width: '100px',
          height: '100px',
          backgroundSize: '100% 100%',
          position: 'relative',
        }}
      />
      {renderCypressEle()}
    </div>
  );

  return (
    <ThemeProvider theme={theme}>
      {/*{drawerOpen && (*/}
      {/*  <div*/}
      {/*    onClick={() => window.SingularityEvent.close()}*/}
      {/*    style={{*/}
      {/*      height: '100vh',*/}
      {/*      width: '100vw',*/}
      {/*      backgroundColor: 'black',*/}
      {/*      position: 'fixed',*/}
      {/*      top: 0,*/}
      {/*      left: 0,*/}
      {/*      zIndex: 1,*/}
      {/*      opacity: 0.5,*/}
      {/*    }}*/}
      {/*  />*/}
      {/*)}*/}

      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/marketplace" element={<NFTMarketplace />} />
      </Routes>
      {renderCypressEle()}
    </ThemeProvider>
  );
}

export default App;

/*
demo-sandbox.s9y.gg

*/
