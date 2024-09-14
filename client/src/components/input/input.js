import * as React from 'react';
import './input.css';

export default function Textinput({ width, type, content ,value,onChange}) {
  return (
    <div>
       <div className="inputform" style={{ width: `${width}%` }}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required
      />
      <label className="label-name">
        <span className="content-name">{content}</span>
      </label>
    </div>
    </div>
  );
}
