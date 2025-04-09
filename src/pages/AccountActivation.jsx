import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ActivateAccount = () => {
  const [status, setStatus] = useState("activating");
  const { uid, token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const activateAccount = async () => {
      try {
        await axios.post("http://127.0.0.1:8000/auth/users/activation/", {
          uid,
          token,
        });
        setStatus("success");
        setTimeout(() => navigate("/login"), 3000);
      } catch (error) {
        setStatus("error");
      }
    };

    activateAccount();
  }, [uid, token, navigate]);

  return (
    <div>
      {status === "activating" && <p>Activating your account...</p>}
      {status === "success" && (
        <div>
          <h2>Account Activated!</h2>
          <p>Your account has been successfully activated.</p>
          <p>Redirecting to login page...</p>
        </div>
      )}
      {status === "error" && (
        <div>
          <h2>Activation Failed</h2>
          <p>Unable to activate your account. Please try again.</p>
        </div>
      )}
    </div>
  );
};

export default ActivateAccount;
