import React from 'react';
import './MsgBox.css';

import { useTranslation } from 'react-i18next';

function MsgBox(props) {

    const { t } = useTranslation();

    const confirmCallBack = props.confirmCallBack;

    let title;

    // 没有类型的时候 直接使用标题
    if (typeof props.popType === 'undefined') {
        title = props.title;
    } else if (props.popType === 1) {
        title = t('detail.unstake');
    } else if (props.popType === 2) {
        title = t('detail.feed');
    }

    let btnArea;
    if (props.confirm) {
        btnArea = <div className="msg-box-btn-area">
            <div className="msg-box-cancel" onClick={() => confirmCallBack(false)}>{t('header.cancel')}</div>
            <div className="msg-box-confirm btn" onClick={() => confirmCallBack(true)}>{t('detail.confirm')}</div>
        </div>
    } else {
        btnArea = <div className="msg-box-btn-area">
            <div className="msg-box-cancel" onClick={() => confirmCallBack(false)}>{t('header.cancel')}</div>
        </div>
    }

    return (
        <div className="msg-box-layer">
            <div className="msg-box">
                <div className="msg-box-title">{title}
                    <i className="msg-box-close" onClick={() => confirmCallBack(false)}></i>
                </div>

                {props.msg}

                {btnArea}
            </div>
        </div>
    );
}

export default MsgBox;
