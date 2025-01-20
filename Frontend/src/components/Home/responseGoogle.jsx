import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "../../api.js";

export default (props) => {
  const responseGoogle = async (authResult) => {
    try {
      if (authResult["code"]) {
        console.log(authResult.code);
        const result = await googleAuth(authResult.code);
        props.setUser(result.data.user);
        alert("successfully logged in");
      } else {
        console.log(authResult);
        throw new Error(authResult);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <button
      style={{
        padding: "10px 20px",
      }}
      onClick={googleLogin}
    >
      Sign in with Google
    </button>
  );
};
