import * as React from 'react';
import './input.css';

export default function Textinput({ width, type, content ,value,onChange ,name,maxLength, number, style,margin}) {
  return (
    <div>
       <div className="inputform" style={{ width: `${width}%` ,margin:`${margin}`}}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        name={name}
        maxLength={maxLength}
        style={{style}}
      />
      <label className="label-name">
        <span className="content-name">{content}</span>
        <span className="content-number">{number}</span>
      </label>
    </div>
    </div>
  );
}
