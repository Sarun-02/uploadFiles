// SignIn.js
import { useState } from "react";
import "./signIn.css";
import FileUpload from "./fileUpload";

function SignIn() {
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (userName !== "vennai" && password !== "2002") {
      alert("Olunga username password podu da venna");
    } else {
      alert("Super Aksh correct aa potutiye click ok to proceed");
      setIsLoggedIn(true);
    }
    setUserName("");
    setPassword("");
  };
  if (isLoggedIn) {
    return <FileUpload />;
  }

  return (
    <div className="mainFrame">
      <div className="left">
        <h1>
          Upload Anything <br /> Miss
        </h1>
      </div>
      <div className="right">
        <div className="right-content">
          <form className="form-content">
            <h2 className="form-title">Login</h2>
            <input
              placeholder="Enter User Name"
              type="text"
              value={userName}
              required
              onChange={(e) => setUserName(e.target.value.toLowerCase())}
            />
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value.toLowerCase())}
            />
            <button type="submit" onClick={handleSubmit}>
              {" "}
              Submit{" "}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
