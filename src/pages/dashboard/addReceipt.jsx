import React, { useEffect, useState } from "react";
import axios from "axios";
import Datepicker from "react-tailwindcss-datepicker";
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

export function AddReceipt() {
    const API_URL = import.meta.env.VITE_API_URL;

    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = () => {
        if (file) {
            const formData = new FormData();
            formData.append('csvFile', file);

            axios
                .post('http://localhost:3000/receipts/upload', formData)
                .then((response) => {
                    console.log(response.data);
                })
                .catch((error) => {
                    console.error('Error uploading CSV:', error);
                });
        } else {
            console.error('Please select a CSV file before uploading.');
        }
    };

    return(
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
                    <Typography variant="h6" color="white">
                        Add Payments
                    </Typography>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <Input type="file" accept=".csv" onChange={handleFileChange}></Input>
                    <Button onClick={handleUpload}>Upload Payments</Button>
                </CardBody>
            </Card>
        </div>
    )
}

export default AddReceipt;