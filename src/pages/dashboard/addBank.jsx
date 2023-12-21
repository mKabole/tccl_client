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

export function AddBank() {

    const API_URL = import.meta.env.VITE_API_URL;

    const [organizations, setOrganizations] = useState([]);
    const [selectedOrganization, setSelectedOrganization] = useState('');

    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState('');

    const [bankData, setBankData] = useState({
        bankName: "",
        branch: "",
        accountNumber: "",
        accountName: "",
        swiftCode: "",
    });

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
    };

    const handleClientDropdownChange = (e) => {
        const selectedCli = e
        console.log(selectedCli)
        setSelectedClient(selectedCli)
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBankData({
            ...bankData,
            [name]: value,
        });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Create an object to send to your API
        const postData = {
            clientID: selectedClient,
            bank: bankData.bankName,
            branch: bankData.branch,
            account_no: bankData.accountNumber,
            account_name: bankData.accountName,
            swift_code: bankData.swiftCode
        };

        console.log(postData)

        // Send a POST request to your API to save the bank data
        axios.post(`${API_URL}/banks`, postData)
            .then((response) => {
                // Handle success, e.g., show a success message or reset the form
                console.log(`Bank details added for ${selectedClient}`)
            })
            .catch((error) => {
                console.error('Error posting bank data:', error);
                // Handle error, e.g., show an error message
            });
    };

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
                    <Typography variant="h6" color="white">
                        Add Client's Bank Details
                    </Typography>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <form className="my-12 grid lg:grid-cols-3 gap-6 px-12" onSubmit={handleFormSubmit}>
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
                        >
                            {clients.map((client) => (
                                <Option key={client.id} value={client.id}>
                                    {client.firstname + " " + client.lastname}
                                </Option>
                            ))}
                        </Select>
                        <Input label="Bank Name" name="bankName" size="lg" onChange={handleInputChange}  />
                        <Input label="Branch" name="branch" size="lg" onChange={handleInputChange}  />
                        <Input type="number" name="accountNumber" label="Account Number" size="lg" onChange={handleInputChange}  />
                        <Input label="Account Name" name="accountName" size="lg" onChange={handleInputChange}  />
                        <Input label="Swift Code" name="swiftCode" size="lg" onChange={handleInputChange}  />
                        <div className="text-center col-span">
                            <Button type="submit"> Add Bank Details</Button>
                        </div>
                    </form>
                </CardBody>
            </Card>
        </div>

    );
}

export default AddBank;