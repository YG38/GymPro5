import React, { useState, useEffect } from "react";

const Notification = ({ message, type }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return <div className={`notification ${type}`}>{message}</div>;
};

export default Notification;