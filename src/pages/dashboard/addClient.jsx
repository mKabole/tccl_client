import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Typography,
    Card,
    CardHeader,
    CardBody,
    Input,
    Button,
    Select,
    Option
} from "@material-tailwind/react";
import Datepicker from "react-tailwindcss-datepicker";

export function AddClient() {

    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const [organizations, setOrganizations] = useState([]);
    const [selectedOrganization, setSelectedOrganization] = useState('');

    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const [clientData, setClientData] = useState({
        firstname: "",
        lastname: "",
        phone: "",
        email: "",
        address: "",
        employee_no: "",
        next_of_kin: "",
        nrc: "",
    });

    const [dateValue, setDateValue] = useState({
        startDate: null,
        endDate: null
    })

    const handleDropdownChange = (e) => {

        const selectedOrg = e;
        console.log(selectedOrg)
        setSelectedOrganization(selectedOrg);

    };

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    };

    const handlePhotoInputChange = (e) => {
        const file = e.target.files[0];
        setSelectedPhoto(file);
    };

    const handleDateValueChange = (newDateValue) => {
        setDateValue(newDateValue)
    }

    useEffect(() => {
        // Make an HTTP request to your Node.js API to fetch user_roles data
        axios.get(`${API_URL}/organizations`)
            .then((response) => {
                setOrganizations(response.data.data);
            })
            .catch((error) => {
                console.error('Error fetching organizations list:', error);
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setClientData({
            ...clientData,
            [name]: value,
        });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("file", selectedFile);

        const formData2 = new FormData();
        formData2.append("file", selectedPhoto);

        Promise.all([
            axios.post(`${API_URL}/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }),
            axios.post(`${API_URL}/upload`, formData2, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
        ]).then((fileResponse) => {
            // const fileUrl = fileResponse.data; // Get the file URL from the server response
            const urls = fileResponse.map((response) => response.data);

            // Include the file URL in your data to be sent to the API
            const postData = {
                organizationID: selectedOrganization,
                firstname: clientData.firstname,
                lastname: clientData.lastname,
                phone: clientData.phone,
                email: clientData.email,
                date_of_birth: dateValue.startDate,
                address: clientData.address,
                employment_address: clientData.employment_address,
                employee_no: clientData.employee_no,
                next_of_kin: clientData.next_of_kin,
                nrc: clientData.nrc,
                nrc_url: urls[0],
                photo_url: urls[1]
            };

            console.log(postData)

            // Send a POST request to your API with updated postData
            axios.post(`${API_URL}/clients`, postData)
                .then((response) => {
                    // Handle success, e.g., show a success message or reset the form
                    console.log(`Client details and file uploaded`);
                    navigate("/dashboard/clients");
                })
                .catch((error) => {
                    console.error('Error posting client data and file:', error);
                    // Handle error, e.g., show an error message
                });
        }).catch((error) => {
            console.error('Error uploading file:', error);
            // Handle error, e.g., show an error message
        });

    };


    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
                    <Typography variant="h6" color="white">
                        Add New Client
                    </Typography>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <form className="my-12 grid lg:grid-cols-3 gap-6 px-12" onSubmit={handleFormSubmit}>
                        <Input name="firstname" label="First Name" size="lg" onChange={handleInputChange} />
                        <Input name="lastname" label="Last Name" size="lg" onChange={handleInputChange} />
                        <Input name="phone" label="Phone" size="lg" onChange={handleInputChange} />
                        <Input name="email" type="email" label="Email" size="lg" onChange={handleInputChange} />
                        <Datepicker
                            asSingle={true}
                            useRange={false}
                            placeholder="Date OF Birth"
                            value={dateValue}
                            displayFormat={"DD/MM/YYYY"}
                            onChange={handleDateValueChange}
                        />
                        <Input name="address" label="Address" size="lg" onChange={handleInputChange} />
                        <Select
                            variant="outlined"
                            label="Organization"
                            value={selectedOrganization}
                            onChange={handleDropdownChange}
                            size="lg"
                        >
                            {organizations.map((org) => (
                                <Option key={org.id} value={org.id}>
                                    {org.name}
                                </Option>
                            ))}
                        </Select>
                        <Input name="employment_address" label="Employment Address" size="lg" onChange={handleInputChange} />
                        <Input name="employee_no" label="Employee Number" size="lg" onChange={handleInputChange} />
                        <Input name="next_of_kin" label="Next of Kin (Name and Phone Number)" size="lg" onChange={handleInputChange} />
                        <Input name="nrc" label="NRC" size="lg" onChange={handleInputChange} />
                        <Input name="photo_url" type="file" label="Upload Photo" size="lg" onChange={handlePhotoInputChange} />
                        <Input name="nrc_url" type="file" label="Upload NRC" size="lg" onChange={handleFileInputChange} />
                        <div className="text-center col-span">
                            <Button type="submit">Add Client</Button>
                        </div>
                    </form>
                </CardBody>
            </Card>
        </div>

    );
}

export default AddClient;