import React, { useState } from "react";

const Notification = ({ active, text }) => {
  const [isActive, setIsActive] = useState(active);

  setTimeout(() => {
    setIsActive("");
  }, 3000);

  return (
    <div>
      <h5 className={`notification ${isActive}`}>{text}</h5>
    </div>
  );
};

export default Notification;
