import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';
import { Link, useLocation } from "react-router-dom";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
    Input,
} from "@material-tailwind/react";

export function Receipts() {

    const API_URL = import.meta.env.VITE_API_URL;

    const [receipts, setReceipts] = useState([]);
    const [page, setPage] = useState(1);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const batchId = queryParams.get('batch_no');

    useEffect(() => {
        // Make an HTTP request to fetch data from your API
        axios.get(`${API_URL}/receipts/batch/${batchId}`) // Replace with your actual API endpoint
            .then((response) => {
                setReceipts(response.data);
                console.log(response.data)
            })
            .catch((error) => {
                console.error('Error fetching receipts data:', error);
            });
    }, [page]);

    const addPayments = (e) => {
        e.preventDefault();

        // Create an object to send to your API
        const postData = {
            batch_no: batchId
        };

        console.log(postData)

        // Send a POST request to your API to save the bank data
        axios.post(`${API_URL}/payments/multiple`, postData)
            .then((response) => {
                // Handle success, e.g., show a success message or reset the form
                console.log(`payment details added`)
            })
            .catch((error) => {
                console.error('Error posting payment data:', error);
                // Handle error, e.g., show an error message
            });
    };

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
                    <div className='grid lg:grid-cols-2 lg:space-x-24 lg:gap-24  w-100'>
                        <Typography variant="h6" color="white">
                            Receipts
                        </Typography>
                        <div className='flex lg:justify-end'>
                            <Button color='white' ripple={true} variant='gradient' onClick={addPayments}>
                                    Add Payments
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                            <tr>
                                {[
                                    "NRC", "Total", "Date Created"
                                ].map((el) => (
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
                            {receipts.map((receipt) => {
                                const className = `py-3 px-5 ${receipt.length - 1
                                    ? ""
                                    : "border-b border-blue-gray-50"
                                    }`;

                                return (
                                    <tr key={receipt.batch_no}>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {receipt.nrc}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {receipt.total}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {receipt.created}
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
export default Receipts;