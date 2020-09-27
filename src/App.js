import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

import './App.css';
import MsgBox from './components/MsgBox/MsgBox';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './views/Home/Home';
import Menu from './views/Menu/Menu';
import Detail from './views/Detail/Detail';
import NoMatch from './views/NoMatch/NoMatch';

import './tools/wallet';

// 优化写个加载页面，越简单越好
const Loader = () => (
  <div>loading...</div>
);

function App() {

  const { t } = useTranslation();

  const [isWarning, setWarning] = useState(false);

  // 优化的分离出组件
  let msg = <div className="msg-box-body">
    <div className="msg-box-icon-area">
      <i className="msg-box-icon"></i>
    </div>
    {/* <div className="download-msg">执行任何操作的时候，您需要安装 <a target="new_tab" href="https://chrome.google.com/webstore/detail/tronlink%EF%BC%88%E6%B3%A2%E5%AE%9D%E9%92%B1%E5%8C%85%EF%BC%89/ibnejdfjmmkpcnlpebklmnkoeoihofec">TronLink</a>。</div> */}
    <div className="download-msg">{t('app.install')} <a target="new_tab" href="https://chrome.google.com/webstore/detail/tronlink%EF%BC%88%E6%B3%A2%E5%AE%9D%E9%92%B1%E5%8C%85%EF%BC%89/ibnejdfjmmkpcnlpebklmnkoeoihofec">TronLink</a>。</div>
  </div>

  useEffect(() => {
    const timerRec = setTimeout(() => {

      if (!window.tronWeb || !window.tronWeb.defaultAddress.base58) {
        setWarning(true);
      }

      clearTimeout(timerRec);

    }, 1 * 1000);

    return () => {
      clearTimeout(timerRec);
    }
  },[]);

  return (
    <Suspense fallback={<Loader />}>
      < div className="App" >
        <div className="down-box">
          {/* <MsgBox show={!hasBom} msg={msg} /> */}
          {isWarning && <MsgBox msg={msg} title={t('app.warning')} confirmCallBack={() => setWarning(false)} />}
        </div>
        <Router>
          <Header />
          <Switch>
            <Route exact path="/" component={Home}></Route>
            <Route exact path="/menu" component={Menu}></Route>
            <Route exact path="/detail" component={Detail}></Route>
            <Route component={NoMatch} exact></Route>
          </Switch>
        </Router>
        <Footer />
      </div >
    </Suspense>
  );
}

export default App;
