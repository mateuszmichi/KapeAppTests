import React from "react";
// imported elements
// ant.design

const UseData = ({ update, data }) => {
  const addData = () => {
    update(Object.assign({}, data, { nval: 10 }));
  };
  const remove = () => {
    update({});
  };
  return (
    <div className="UseData">
      <p>TEST</p>
      <button onClick={addData}>Dodaj</button>
      <button onClick={remove}>Usun</button>
    </div>
  );
};

export default UseData;
