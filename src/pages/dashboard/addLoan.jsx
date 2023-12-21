import React, { useEffect, useState } from "react";
import axios from "axios";
import Datepicker from "react-tailwindcss-datepicker";
import { Link, useNavigate } from "react-router-dom";
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

export function AddLoan() {

    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const [organizations, setOrganizations] = useState([]);
    const [selectedOrganization, setSelectedOrganization] = useState('');

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [fileUrls, setFileUrls] = useState([]);

    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState('');

    const [status, setStatus] = useState([]);
    const [selectedStatus, setSelectedCStatus] = useState('');

    const [banks, setBanks] = useState([]);
    const [selectedBank, setSelectedBank] = useState('');

    const [dateValue, setDateValue] = useState({
        startDate: null,
        endDate: null
    })

    const [dueDateValue, setDueDateValue] = useState({
        startDate: null,
        endDate: null
    })

    const [loanData, setLoanData] = useState({
        contract_date: "",
        clientID: "",
        organizationID: "",
        bankID: "",
        amount: "",
        interest_percentage: "",
        cycle: ""
    });

    //Get list of organizations
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

    // Get list of clients after an organization is selected
    const handleDropdownChange = (e) => {

        const selectedOrg = e;
        console.log(selectedOrg)
        setSelectedOrganization(selectedOrg);

        // Fetch client names based on the selected organization
        axios.get(`${API_URL}/clients/organization/${selectedOrg}`)
            .then((response) => {
                setClients(response.data);
            })
            .catch((error) => {
                console.error('Error fetching client names:', error);
            }
            );
    }

    // Get list of client's banks after client is selected
    const handleClientDropdownChange = (e) => {
        const selectedLoanClient = e
        console.log(selectedLoanClient)
        setSelectedClient(selectedLoanClient);

        // Fetch banks based on the client
        axios.get(`${API_URL}/banks/client/${selectedLoanClient}`)
            .then((response) => {
                setBanks(response.data);
            })
            .catch((error) => {
                console.error('Error fetching banks list:', error);
            }
            );
    }

    // Event handler for banks dropdown change
    const handleBankDropdownChange = (e) => {
        const selectedbank = e
        setSelectedBank(selectedbank);
    }

    const handleDateValueChange = (newDateValue) => {
        setDateValue(newDateValue)
    }

    const handleDueDateValueChange = (newDueDateValue) => {
        setDueDateValue(newDueDateValue)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoanData({
            ...loanData,
            [name]: value,
        });
    }

    const handleFileInputChange = (e) => {
        const files = e.target.files;
        setSelectedFiles(files);
    }

    //Submit loan data from form
    const handleFormSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append("files", selectedFiles[i]);
        }

        // ...

        axios.post(`${API_URL}/upload/multiple`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then((fileResponse) => {
                const urls = fileResponse.data; // Get an array of file URLs from the server

                // Include the file URLs in your data to be sent to the API
                const postData = {
                    contract_date       : dateValue.startDate,
                    clientID            : selectedClient,
                    organizationID      : selectedOrganization,
                    bankID              : selectedBank,
                    amount              : loanData.amount,
                    interest_percentage : loanData.interest_percentage,
                    cycle               : loanData.cycle,
                    payslip_url1        : urls[0], 
                    payslip_url2        : urls[1],
                    statusID            : 1
                };

                console.log(postData)

                // Send a POST request to your API with updated postData
                axios.post(`${API_URL}/loans`, postData)
                    .then((response) => {
                        // Handle success, e.g., show a success message or reset the form
                        console.log(`Loan details and files uploaded for ${selectedClient}`);
                        navigate("/dashboard/loans");
                    })
                    .catch((error) => {
                        console.error('Error posting loan data and files:', error);
                        // Handle error, e.g., show an error message
                    });
            })
            .catch((error) => {
                console.error('Error uploading files:', error);
                // Handle error, e.g., show an error message
            });
    };


    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
                    <Typography variant="h6" color="white">
                        Add New Loan
                    </Typography>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <form className="my-12 grid grid-cols-3 gap-6 px-12" onSubmit={handleFormSubmit} >
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
                        <Select
                            variant="outlined"
                            label="Full Name"
                            value={selectedClient}
                            onChange={handleClientDropdownChange}
                            size="lg"
                            disabled={!selectedOrganization}
                            aria-required
                        >
                            {clients.map((client) => (
                                <Option key={client.id} value={client.id}>
                                    {client.firstname + " " + client.lastname}
                                </Option>
                            ))}
                        </Select>
                        <Select
                            variant="outlined"
                            label="Bank Account"
                            value={selectedBank}
                            onChange={handleBankDropdownChange}
                            size="lg"
                            disabled={!selectedClient}
                        >
                            {banks.map((bank) => (
                                <Option key={bank.id} value={bank.id}>
                                    {bank.account_name + " - " + bank.account_no}
                                </Option>
                            ))}
                        </Select>
                        <Input name="amount" type="number" label="Amount"
                            size="lg" required onChange={handleInputChange} />
                        <Input name="interest_percentage" type="number" label="Interest (%)"
                            size="lg" onChange={handleInputChange} />
                        <Input name="cycle" type="number" label="Cycle (Number of Months)"
                            size="lg" onChange={handleInputChange} />
                        <Input type="file" label="Upload Last 2 Payslips" multiple
                            size="lg" onChange={handleFileInputChange} />
                        <Datepicker
                            asSingle={true}
                            useRange={false}
                            placeholder="Contract Date"
                            value={dateValue}
                            displayFormat={"DD/MM/YYYY"}
                            onChange={handleDateValueChange}
                        />
                        <div className="text-center col-span">
                            <Button type="submit">Add Loan</Button>
                        </div>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
}

export default AddLoan;