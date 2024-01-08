import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,

} from "@material-tailwind/react";

export function Loans() {

    const API_URL = import.meta.env.VITE_API_URL;

    const [loans, setLoans] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        // Make an HTTP request to fetch data from your API
        axios.get(`${API_URL}/loans?page=${page}`) // Replace with your actual API endpoint
            .then((response) => {
                setLoans(response.data.data);
                console.log(response.data.data)
            })
            .catch((error) => {
                console.error('Error fetching loan data:', error);
            });
    }, [page]);

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
                    <div className='grid lg:grid-cols-2 lg:space-x-24 lg:gap-24  w-100'>
                        <Typography variant="h6" color="white">
                            Loans
                        </Typography>
                        <div className='flex lg:justify-end'>
                            <Button color='white' ripple={true} variant='gradient'>
                                <Link to="/dashboard/add-loan">
                                    Add Loan
                                </Link>
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                            <tr>
                                {["Client Name", "Email", "Phone", "Organization", "Status", "Amount", " "].map((el) => (
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
                            {loans.map((loan) => {
                                const className = `py-3 px-5 ${loans.length - 1
                                    ? ""
                                    : "border-b border-blue-gray-50"
                                    }`;

                                return (
                                    <tr key={loan.id}>
                                        <td className={className}>
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-semibold"
                                                    >
                                                        {loan.client_firstname + " " + loan.client_lastname}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {loan.client_mail}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {loan.client_phone}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {loan.organization_name}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {loan.status}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {loan.amount}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                <Link to={`/dashboard/loan-details?loan_id=${loan.id}`}>
                                                    More Details
                                                </Link>
                                            </Typography>
                                        </td>
                                    </tr>
                                );
                            })}
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

export default Loans;