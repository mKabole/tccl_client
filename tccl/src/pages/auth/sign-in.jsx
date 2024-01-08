import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";

export function SignIn() {
  const { login } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Send login data to API
    axios.post(`${API_URL}/users/login`, userData)
      .then((response) => {
        // Handle successful login
        if (response.data) {
          console.log("User logged in successfully:", response.data);
          login();
          navigate("/dashboard/home");
        } else {
          setError("Invalid email or password. Please try again.");
        }

      })
      .catch((error) => {
        // Handle login error
        console.error('Error logging in:', error);
        setError("Invalid email or password. Please try again.");
      });
  };

  return (
    <>
      <img
        src="https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 z-0 h-full w-full bg-black/50" />
      <div className="container mx-auto p-4">
        <Card className="absolute top-2/4 left-2/4 w-full max-w-[24rem] -translate-y-2/4 -translate-x-2/4">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-4 grid h-28 place-items-center"
          >
            <Typography variant="h5" color="white">
              Transparent Chartered Credit
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <form className="grid lg:grid-cols-1 gap-6" onSubmit={handleSubmit}>
              <Input name="email" type="email" label="Email" size="lg" onChange={handleInputChange} />
              <Input name="password" type="password" label="Password" size="lg" onChange={handleInputChange} />
              <div className="-ml-2.5">
                <Checkbox label="Remember Me" />
              </div>
              <Button type="submit" variant="gradient" fullWidth>
                Sign In
              </Button>
            </form>
          </CardBody>
          <CardFooter className="pt-0">
            {error && ( // Render error message conditionally
              <Typography variant="caption" color="red">
                {error}
              </Typography>
            )}

            <Typography variant="small" className="mt-6 flex justify-center">
              Don't have an account?
              <Link to="/auth/sign-up">
                <Typography
                  as="span"
                  variant="small"
                  color="blue"
                  className="ml-1 font-bold"
                >
                  Sign up
                </Typography>
              </Link>
            </Typography>

          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default SignIn;
