// ./src/Components/SignInwithGoogle.jsx
'use client';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../Components/firebase";
import { toast } from "react-toastify";
import { setDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";


function SignInwithGoogle() {
  const router = useRouter();

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(doc(db, "Users", user.uid), {
        email: user.email,
        firstName: user.displayName || "",
        lastName: "",
        photo: user.photoURL || "",
      }, { merge: true });

      toast.success(`Welcome, ${user.displayName || "User"}!`, {
        position: "top-center",
      });

      router.push("/home");
    } catch (error) {
      console.error("Google Sign-In error:", error.code, error.message);
      toast.error(`Google Sign-In failed: ${error.code || error.message}`, {
        position: "bottom-center",
      });
    }
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
