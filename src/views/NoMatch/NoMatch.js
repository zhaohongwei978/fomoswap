import React from 'react';

function NoMatch({location}){
    return (<h1>页面没有找到{location.pathname}</h1>);
}

export default NoMatch;