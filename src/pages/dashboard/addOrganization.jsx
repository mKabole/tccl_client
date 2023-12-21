import React, { useEffect, useState } from "react";
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

export function AddOrganization() {

    const API_URL = import.meta.env.VITE_API_URL;

    const [selectedGrz, setSelectedGrz] = useState('');

    const [organizationData, setOrganizationData] = useState({
        name: "",
        phone: "",
        email: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrganizationData({
            ...organizationData,
            [name]: value,
        });
    };

    const handleDropdownChange = (e) => {
        const isGrz = e;
        console.log(isGrz)
        setSelectedGrz(isGrz);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Create an object to send to your API
        const postData = {
            name: organizationData.name,
            address: organizationData.address,
            phone: organizationData.phone,
            grz: selectedGrz
        };

        console.log(postData)

        // Send a POST request to your API to save the bank data
        axios.post(`${API_URL}/organizations`, postData)
            .then((response) => {
                // Handle success, e.g., show a success message or reset the form
                console.log(`Organization details added`)
            })
            .catch((error) => {
                console.error('Error posting Organization data:', error);
                // Handle error, e.g., show an error message
            });
    };

    return (
        <div className="mt-12 mb-12 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
                    <Typography variant="h6" color="white">
                        Add New Organization
                    </Typography>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <form className="lg:m-12 grid lg:grid-cols-3 gap-6 px-12" onSubmit={handleFormSubmit}>
                        <Input name="name" label="Organization Name" size="lg" onChange={handleInputChange} />
                        <Input name="address" label="Organization Address" size="lg" onChange={handleInputChange} />
                        <Input name="phone" type="number" label="Phone Number" size="lg" onChange={handleInputChange} />
                        <Select
                            variant="outlined"
                            label="Is the Organazation GRZ?"
                            size="lg"
                            onChange={handleDropdownChange}
                        >
                            <Option value="1">True</Option>
                            <Option value="0">False</Option>
                        </Select>
                        <Button type="submit">Add Organization</Button>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
}

export default AddOrganization;