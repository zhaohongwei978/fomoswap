import React from 'react';
import tigerLogo from '../../assets/logo2.png';

import styles from './styles.module.css';

export default () => {

  return (
    <div className={styles.root}>
      <img src={tigerLogo} className={styles.loading_img} alt="logo" />
    </div>
  );
}
