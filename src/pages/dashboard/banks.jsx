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

export function Banks() {

    const API_URL = import.meta.env.VITE_API_URL;

    const [banks, setBanks] = useState([]);
    const [page, setPage] = useState(1);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${API_URL}/banks?page=${page}`);
            if (response.data.data.length > 0) {
                setBanks(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching bank details:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page]);

    const handleNextPage = () => {
        setPage(page + 1);
    };

    const handlePrevPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
                    <div className='grid lg:grid-cols-2 lg:space-x-24 lg:gap-24  w-100'>
                        <Typography variant="h6" color="white">
                            Client Banks
                        </Typography>
                        <div className='flex lg:justify-end'>
                            <Button color='white' ripple={true} variant='gradient'>
                                <Link to="/dashboard/add-bank">
                                    Add Bank Details
                                </Link>
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                            <tr>
                                {["Account Number", "Account Name", "Bank", "Branch", "Swift Code", "Client Name", "Organization"].map((el) => (
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
                            {banks.map((bank) => {
                                const className = `py-3 px-5 ${banks.length - 1
                                    ? ""
                                    : "border-b border-blue-gray-50"
                                    }`;

                                return (
                                    <tr key={bank.id}>
                                        <td className={className}>
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-semibold"
                                                    >
                                                        {bank.account_no}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {bank.account_name}
                                            </Typography>

                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {bank.bank}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {bank.branch}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {bank.swift_code}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {bank.clientFirstname + " " + bank.clientLastname}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {bank.organizationName}
                                            </Typography>
                                        </td>
                                    </tr>
                                );
                            }
                            )}
                        </tbody>
                    </table>
                    <div className='px-12 mx-12 py-6 flex justify-center gap-4'>
                        <Button onClick={handlePrevPage} ripple={true} variant='gradient'>
                            Prev
                        </Button>
                        <Button onClick={handleNextPage} ripple={true} variant='gradient'>
                            Next
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </div>
    );

}

export default Banks;