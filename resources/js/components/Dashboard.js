import * as React from "react";

// Disable eslint car React admin utilise un export default non accepté par eslint
export default () => ( //eslint-disable-line
  <div style={{ fontFamily: "sans-serif" }}>
    <h1 style={{ textAlign: "center" }}>Kering test app</h1>
    <p>Back: Express + mongoose</p>
    <p>Front: React + React-admin</p>
  </div>
);
