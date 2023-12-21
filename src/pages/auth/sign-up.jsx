import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import bcrypt from "bcryptjs";
import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Input,
	Checkbox,
	Button,
	Typography,
	Select,
	Option
} from "@material-tailwind/react";
import axios from "axios";


export function SignUp() {

	const { login } = useAuth();
	const API_URL = import.meta.env.VITE_API_URL;
	const navigate = useNavigate();

	const [userRoles, setUserRoles] = useState([]);
	const [selectedRole, setSelectedRole] = useState('');
	const [password2, setPassword2] = useState('');

	const [userData, setUserData] = useState({
		firstname: "",
		lastname: "",
		email: "",
		roleID: "",
		password: "",
	});

	useEffect(() => {

		axios.get(`${API_URL}/users/user-roles`)
			.then((response) => {
				setUserRoles(response.data);
				console.log(response)
			})
			.catch((error) => {
				console.error('Error fetching user roles:', error);
			});
	}, []);

	const handleDropdownChange = (e) => {
		const SelectedRole = e
		setSelectedRole(SelectedRole);
		setUserData({
			...userData,
			roleID: selectedRole
		})
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setUserData({
			...userData,
			[name]: value,
		});
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		// Check if passwords match
		if (userData.password !== password2) {
			console.error("Passwords do not match");
			return;
		}

		// Send registration data to API
		axios.post(`${API_URL}/auth/signup`, userData)
			.then((response) => {
				// Handle successful registration
				console.log("User registered successfully");
				navigate("/auth/sign-up");
			})
			.catch((error) => {
				// Handle registration error
				console.error('Error registering user:', error);
				// Show error message to user
			}
		);

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
						<Typography variant="h4" color="white">
							Create New User Account
						</Typography>
					</CardHeader>
					<CardBody className="flex flex-col gap-4">
						<form className="grid lg:grid-cols-1 gap-6" onSubmit={handleSubmit}>
							<Input name="firstname" label="First Name" size="lg" onChange={handleInputChange} />
							<Input name="lastname" label="Last Name" size="lg" onChange={handleInputChange} />
							<Input name="email" type="email" label="Email" size="lg" onChange={handleInputChange} />
							<Select
								variant="outlined"
								label="Role"
								value={selectedRole}
								onChange={handleDropdownChange}
								size="lg"
							>
								{userRoles.map((role) => (
									<Option key={role.id} value={role.id}>
										{role.role}
									</Option>
								))}
							</Select>
							{/* <Input label="Role" size="lg" /> */}
							<Input name="password" type="password" label="Password" size="lg" onChange={handleInputChange} />
							<Input
								name="password2"
								type="password"
								label="Confirm Password"
								value={password2}
								size="lg"
								onChange={(e) => setPassword2(e.target.value)}
							/>
							<div className="-ml-2.5">
								<Checkbox label="I agree the Terms and Conditions" />
							</div>
							<Button type="submit" variant="gradient" fullWidth>
								Sign Up
							</Button>
						</form>
					</CardBody>
					<CardFooter className="pt-0">

						<Typography variant="small" className="mt-6 flex justify-center">
							Already have an account?
							<Link to="/auth/sign-in">
								<Typography
									as="span"
									variant="small"
									color="blue"
									className="ml-1 font-bold"
								>
									Sign in
								</Typography>
							</Link>
						</Typography>
					</CardFooter>
				</Card>
			</div>
		</>
	);
}

export default SignUp;
