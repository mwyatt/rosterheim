import React from 'react';

export default function Name({ handleChange, name }) {
  return (
    <>
      <h2 className="uppercase mr-2">Name:</h2>
      <input
        className="rounded px-1 border border-slate-400 w-full mr-1 print:hidden"
        name="name"
        type="text"
        onChange={handleChange}
        value={name}
      />
      <span className="screen:hidden print:show">{name}</span>
    </>
  );
}
