import React, { useState } from "react";

const ActionEntry = ({ action }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    action(input);
    setInput("");
  };

  return (
    <form className = "entry" onSubmit={handleSubmit}>
      <input
        id = "query"
        type="text"
        placeholder="Enter your query..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      /> &nbsp;&nbsp;
      <button className = "submit" type="submit">Submit</button>
    </form>
  );
};

export default ActionEntry;
