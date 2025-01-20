import React, { useEffect, useState } from "react";
import "./App.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLogin from "./components/Home/responseGoogle";

function App() {
  const [user, setUser] = useState();

  return (
    <GoogleOAuthProvider clientId="861548536977-uic07d2lpvj1cgb52q4ckkgupk91tf4h.apps.googleusercontent.com">
      <div className="App">
        <GoogleLogin setUser={setUser}></GoogleLogin>
        {user && user.name}
        {user && user.email}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
