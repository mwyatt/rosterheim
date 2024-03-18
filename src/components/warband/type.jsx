import React from "react";

export default function Type({ handleChangeType, type, warbandTypes }) {
  return (
    <>
      <h2 className="uppercase mr-2">Type:</h2>
      <select
        className="print:hidden p-1 border border-black rounded w-full"
        name="type"
        onChange={handleChangeType}
        value={type}
      >
        <option value="">Select Type</option>
        {warbandTypes.map((warbandType) => (
          <option value={warbandType} key={warbandType}>
            {warbandType}
          </option>
        ))}
      </select>
      <span className="screen:hidden print:show">{type}</span>
    </>
  );
}
