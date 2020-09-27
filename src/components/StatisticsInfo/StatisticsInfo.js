import React from 'react'
import './StatisticsInfo.css'

function StatisticsInfo(props) {
    let img = ""

    if (props.name == "balance") {
        img = <div className="statistics-info-img"></div>
    }

    if (props.name == "balance1") {
        img = <div className="statistics-info-img2"></div>
    }

    if (props.name == "supply") {
        img = <div className="statistics-info-img"></div>
    }

    if (props.name == "supply1") {
        img = <div className="statistics-info-img2"></div>
    }

    const imgStyle = {
        width:         "70px",
        display:       "flex",
        alignItems:    "center",
        flexDirection: "column"
    }

    return (
        <div className="statistics-info">
            <div className="statistics-info-img-wrap" style={imgStyle}>
                {img}
            </div>
            <div className="statistics-info-text">
                <div className="statistics-info-text-number">{props.number}</div>
                <div className="statistics-info-text-title">{props.text}</div>
            </div>
        </div>
    )
}

export default StatisticsInfo
