// ./src/Components/SignInwithGoogle.jsx
'use client';
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { auth } from "../Components/firebase";
import { toast } from "react-toastify";


function SignInwithGoogle() {
  const googleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider).catch((error) => {
      console.error("Error starting Google Sign-In: ", error.message);
      toast.error("Google Sign-In failed. Please try again.", {
        position: "bottom-center",
      });
    });
  };

  return (
    <div>
      <p className="continue-p">-- Or continue with --</p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          cursor: "pointer",
        }}
        onClick={googleLogin}
      >
    <img src={'/google.png'} alt="Google Sign-In" width={"60%"} />

      </div>
    </div>
  );
}

export default SignInwithGoogle;
