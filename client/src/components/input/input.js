import * as React from 'react';
import './input.css';

export default function Textinput({ width, type, content ,value,onChange ,name}) {
  return (
    <div>
       <div className="inputform" style={{ width: `${width}%` }}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        name={name}

      />
      <label className="label-name">
        <span className="content-name">{content}</span>
      </label>
    </div>
    </div>
  );
}
