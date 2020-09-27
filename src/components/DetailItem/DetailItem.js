import React from 'react';
import './DetailItem.css';

// 根据状态去判断当前功能、0 批准，1 解压，2质押
function DetailItem(props) {

    let btnbox;

    if (props.btnText2) {
        btnbox = <div className="detail-item-btn-box">
            <div className="detail-item-btn btn" onClick={() => props.onClick(1)}>{props.btnText}</div>
            <div className="detail-item-btn btn" onClick={() => props.onClick(2)}>{props.btnText2}</div>
        </div>
    } else {
        btnbox = <div className="detail-item-btn-box">
            <div className="detail-item-btn btn" onClick={() => props.onClick(0)}>{props.btnText}</div>
        </div>
    }

    // const backGround = {
    //     background: `url(${props.src})`,
    //     backgroundRepeat: 'no-repeat',
    //     backgroundSize: '100%',
    //     backgroundPosition: 'center'
    // };
    //
    const backGround = {
        background: `url(${props.src})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100%',
        backgroundPosition: 'center'
    };

    return (
        <div className="detail-item">
            <div className="detail-item-logo">
                <div className="detail-item-logo-img" style={backGround}></div>
            </div>

            <div className="detail-item-text">
                <div className="statistics-info-text-number">{props.number}</div>
                <div className="statistics-info-text-title">{props.text}</div>
            </div>

            {btnbox}
        </div>
    );
}

export default DetailItem;
