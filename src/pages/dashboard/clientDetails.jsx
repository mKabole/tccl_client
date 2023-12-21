import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';
import { Link, useLocation } from "react-router-dom";
import {
    Card,
    CardBody,
    Avatar,
    Typography,
    Button,
    Input,
    Select,
    Option,

} from "@material-tailwind/react";

export function ClientDetails() {

    const API_URL = import.meta.env.VITE_API_URL;

    const [client, setClient] = useState([]);

    const [loans, setLoans] = useState([]);
    const [page, setPage] = useState(1);

    const [organizations, setOrganizations] = useState([]);
    const [selectedOrganization, setSelectedOrganization] = useState('');

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

    useEffect(() => {
        // Make an HTTP request to fetch data from your API
        axios.get(`${API_URL}/loans/client/${clientId}?page=${page}`) // Replace with your actual API endpoint
            .then((response) => {
                setLoans(response.data.data);
                console.log(response.data.data)
            })
            .catch((error) => {
                console.error('Error fetching loan data:', error);
            });
    }, [page]);

    const handleDropdownChange = (e) => {

        const selectedOrg = e;
        console.log(selectedOrg)
        setSelectedOrganization(selectedOrg);

    };

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const clientId = queryParams.get('client_id');

    useEffect(() => {
        // Make an HTTP request to fetch data from your API
        axios.get(`${API_URL}/clients/client/${clientId}`) // Replace with your actual API endpoint
            .then((response) => {
                setClient(response.data[0]);
                console.log(client)
            })
            .catch((error) => {
                console.error('Error fetching client details:', error);
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

    //Calculate age of the client
    const dateOfBirth = client.date_of_birth
    const parsedDate = new Date(dateOfBirth);
    const formattedDate = formatDate(parsedDate);
    const age = calculateAge(formattedDate)

    //Reformat date created
    const dateCreated = client.created
    const parsedCreated = new Date(dateCreated)
    const formattedCreated = formatDate(parsedCreated)

    const photoUrl = `${API_URL}/files/${client.photo_url}`


    return (
        <>
            <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url(https://images.unsplash.com/photo-1531512073830-ba890ca4eba2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)] bg-cover	bg-center">
                <div className="absolute inset-0 h-full w-full bg-blue-500/50" />
            </div>
            <Card className="mx-3 -mt-16 mb-6 lg:mx-4">
                <CardBody className="p-4">
                    <div className="mb-10 flex items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <Avatar
                                src={photoUrl}
                                alt="Profile_Photo"
                                size="xl"
                                className="rounded-lg shadow-lg shadow-blue-gray-500/40"
                            />
                            <div>
                                <Typography variant="h5" color="blue-gray" className="mb-1">
                                    {client.firstname + " " + client.lastname}
                                </Typography>
                                <Typography
                                    variant="small"
                                    className="font-normal text-blue-gray-600"
                                >
                                    {client.organizationName}
                                </Typography>
                            </div>
                        </div>
                    </div>
                    <div className="grid-cols-1 mb-12 grid px-4 lg:grid-cols-2 xl:grid-cols-2">
                        <div>
                            <Typography variant="h6" color="blue-gray" className="mb-3">
                                {client.firstname + "'s "} Details
                            </Typography>
                            <div className="flex flex-col gap-2">
                                <Typography className=" text-sm font-medium text-blue-gray-500">
                                    Employee Number : {client.employee_no}
                                </Typography>
                                <Typography className=" text-sm font-medium text-blue-gray-500">
                                    NRC : {client.nrc}
                                </Typography>
                                <Typography className=" text-sm font-medium text-blue-gray-500">
                                    Client Age : {age}
                                </Typography>
                                <Typography className=" text-sm font-medium text-blue-gray-500">
                                    Date Of Birth : {formattedDate}
                                </Typography>
                                <Typography className="text-sm font-medium text-blue-gray-500">
                                    Email Address : {client.email}
                                </Typography>
                                <Typography className=" text-sm font-medium text-blue-gray-500">
                                    Phone Number : {client.phone}
                                </Typography>
                                <Typography className="text-sm font-medium text-blue-gray-500">
                                    Home Address : {client.address}
                                </Typography>
                                <Typography className=" text-sm font-medium text-blue-gray-500">
                                    Employment Address : {client.employment_address}
                                </Typography>
                                <Typography className=" text-sm font-medium text-blue-gray-500">
                                    Next Of Kin : {client.next_of_kin}
                                </Typography>
                                <Typography className=" text-sm font-medium text-blue-gray-500">
                                    Date Added : {formattedCreated}
                                </Typography>
                            </div>
                        </div>
                        <div>
                            <Typography variant="h6" color="blue-gray" className="mb-3">
                                Update {" " + client.firstname + "'s "} Details
                            </Typography>
                            <form className="mt-6 grid lg:grid-cols-2 gap-6">
                                <Input name="phone" label="Phone" size="lg" value={client.phone} />
                                <Input name="email" type="email" label="Email" size="lg" value={client.email} />
                                <Input name="address" label="Home Address" size="lg" value={client.address} />
                                <Input name="employment_address" label="Employment Address" size="lg" value={client.employment_address} />
                                <Input name="employee_no" label="Employee Number" size="lg" value={client.employee_no} />
                                <Input name="next_of_kin" label="Next of Kin" size="lg" value={client.next_of_kin} />
                                <div className="flex text-center col-span">
                                    <Button type="submit">Update Client</Button>
                                </div>
                            </form>
                            <hr className='my-4' />
                            <Typography variant="h6" color="blue-gray" className="mb-3">
                                Update {" " + client.firstname + "'s "} Organization
                            </Typography>
                            <form className="mt-6 grid gap-6">
                                <Select
                                    variant="outlined"
                                    label="Organization"
                                    value={`"${client.organizationName}"`}
                                    onChange={handleDropdownChange}
                                    size="lg"
                                >
                                    {organizations.map((org) => (
                                        <Option key={org.id} value={`${org.id}`}>
                                            {org.name}
                                        </Option>
                                    ))}
                                </Select>
                                <div className="flex justify-center text-center col-span">
                                    <Button type="submit">Update Client Organization</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <hr className='my-4' />
                    <div className="px-4 pb-4">
                        <Typography variant="h6" color="blue-gray" className="mb-2">
                            {client.firstname + "'s "} Loans
                        </Typography>
                        <div className="mt-6 grid grid-cols-1">
                            <table className="w-full min-w-[640px] table-auto">
                                <thead>
                                    <tr>
                                        {["Contract Date", "Amount", "Total Collectible", "Status", "Interest (%)", "Interest (ZMW)", "Interest Paid", "Due Date", " "].map((el) => (
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

                                        //Reformat contract date
                                        const contractDate = loan.contract_date
                                        const parsedDate = new Date(contractDate);
                                        const formattedContarctDate = formatDate(parsedDate);

                                        //Reformat contract date
                                        const dueDate = loan.due_date
                                        const parsedDueDate = new Date(dueDate);
                                        const formattedDueDate = formatDate(parsedDueDate);

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
                                                                {formattedContarctDate}
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.amount}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.total_collectible}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.status}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.interest_percentage}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.interest_amount}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.interest_paid}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {formattedDueDate}
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
                        </div>
                    </div>
                </CardBody>
            </Card>
        </>
    );
}
export default ClientDetails;