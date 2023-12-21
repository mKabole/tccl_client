import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button
} from "@material-tailwind/react";

export function Clients() {

    const API_URL = import.meta.env.VITE_API_URL;

    const [clients, setClients] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        // Make an HTTP request to fetch data from your API
        axios.get(`${API_URL}/clients?page=${page}`) // Replace with your actual API endpoint
            .then((response) => {
                setClients(response.data.data);
            })
            .catch((error) => {
                console.error('Error fetching clients:', error);
            });
    }, [page]);

    function calculateAge(dateOfBirth) {
        const dob = new Date(dateOfBirth);
        const currentDate = new Date();

        let yearsDiff = currentDate.getFullYear() - dob.getFullYear();

        // Check if the birthday hasn't occurred this year yet
        if (
            currentDate.getMonth() < dob.getMonth() ||
            (currentDate.getMonth() === dob.getMonth() && currentDate.getDate() < dob.getDate())
        ) {
            yearsDiff--;
        }

        return yearsDiff;
    }

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
                    <div className='grid lg:grid-cols-2 lg:space-x-24 lg:gap-24  w-100'>
                        <Typography variant="h6" color="white">
                            Clients
                        </Typography>
                        <div className='flex lg:justify-end'>
                            <Button color='white' ripple={true} variant='gradient'>
                                <Link to="/dashboard/add-client">
                                    Add Client
                                </Link>
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                            <tr>
                                {["Full Name", "Email", "Phone", "Address", "Organization", "NRC", " "].map((el) => (
                                    <th
                                        key={el}
                                        className="border-b border-blue-gray-50 py-3 px-5 text-left"
                                    >
                                        <Typography
                                            variant="small"
                                            className="text-[11px] font-bold uppercase text-blue-gray-400"
                                        >
                                            {el}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map((client) => {

                                //Calculate age of the client
                                const dateOfBirth = client.date_of_birth
                                const parsedDate = new Date(dateOfBirth);
                                const formattedDate = formatDate(parsedDate);
                                const age = calculateAge(formattedDate)

                                const className = `py-3 px-5 ${clients.length - 1
                                    ? ""
                                    : "border-b border-blue-gray-50"
                                    }`;

                                return (
                                    <tr key={client.id}>
                                        <td className={className}>
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-semibold"
                                                    >
                                                        {client.firstname + " " + client.lastname}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {client.email}
                                            </Typography>

                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {client.phone}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {client.address}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {client.organizationName}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {client.nrc}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                <Link to={`/dashboard/client-details?client_id=${client.id}`}>
                                                    More Details
                                                </Link>
                                            </Typography>
                                        </td>
                                    </tr>
                                );
                            }
                            )}
                        </tbody>
                    </table>
                    <div className='px-12 mx-12 py-6 flex justify-center gap-4'>
                        <Button ripple={true} variant='gradient'>
                            Prev
                        </Button>
                        <Button ripple={true} variant='gradient'>
                            Next
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </div>
    );

}

export default Clients;