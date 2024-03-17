import React from 'react';

export default function ClosePill({
  name,
  handleClick,
}) {
  return (
    <span className="rounded bg-gray-200 p-1 leading-none flex items-center">
      <span className="flex-grow">{name}</span>
      {handleClick
                && (
                <button
                    type="button"
                  className="print:hidden font-bold cursor-pointer text-xl leading-none ml-1 flex-shrink text-rose-700"
                  onClick={handleClick}
                >
                  &times;
                </button>
                )}
    </span>
  );
}
