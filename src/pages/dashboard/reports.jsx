import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import * as XLSX from 'xlsx';
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,

} from "@material-tailwind/react";

export function Reports() {

    const API_URL = import.meta.env.VITE_API_URL;

    const [newLoans, setNewLoans] = useState([]);
    const [settledLoans, setSettledLoans] = useState([]);
    const [arrears, setArrears] = useState([]);
    const [consolidated, setConsolidated] = useState([]);
    const [currentTable, setCurrentTable] = useState(null);

    const [page, setPage] = useState(1);

    const showTable = (tableNumber) => {
        setCurrentTable(tableNumber === currentTable ? null : tableNumber);
    };

    // Get all new loans
    useEffect(() => {

        axios.get(`${API_URL}/loans/new`) // Replace with your actual API endpoint
            .then((response) => {
                setNewLoans(response.data);
            })
            .catch((error) => {
                console.error('Error fetching new loans:', error);
            });
    }, [page]);

    //Get all outright settlements
    useEffect(() => {

        axios.get(`${API_URL}/loans/settled`) // Replace with your actual API endpoint
            .then((response) => {
                setSettledLoans(response.data);
            })
            .catch((error) => {
                console.error('Error fetching new loans:', error);
            });
    }, [page]);

    // Get all loans with arrears
    useEffect(() => {

        axios.get(`${API_URL}/loans/arrears`) // Replace with your actual API endpoint
            .then((response) => {
                setArrears(response.data);
            })
            .catch((error) => {
                console.error('Error fetching new loans:', error);
            });
    }, [page]);

    //Get list of all loans
    useEffect(() => {

        axios.get(`${API_URL}/loans/all`) // Replace with your actual API endpoint
            .then((response) => {
                setConsolidated(response.data);
            })
            .catch((error) => {
                console.error('Error fetching new loans:', error);
            });
    }, [page]);

    //Export to excel button 
    function handleExportToExcel() {
        let table = currentTable
        if (table == 1) {
            const wsData = [
                ["Client Name", "Email", "Phone", "Organization", "Status", "Amount", "Interest(%)", "Contract Date", "Due Date"],
                ...newLoans.map((entry) => [
                    entry.client_firstname + " " + entry.client_lastname,
                    entry.client_mail,
                    entry.client_phone,
                    entry.organization_name,
                    entry.status,
                    entry.amount,
                    entry.interest_percentage,
                    entry.contract_date,
                    entry.due_date
                ]),
            ];

            const ws = XLSX.utils.aoa_to_sheet(wsData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'New Loans Report');
            XLSX.writeFile(wb, 'new_loans_report.xlsx');
        } else if (table == 2) {
            const wsData = [
                ["Client Name", "Phone", "Organization", "Status", "Amount", "Interest(%)", "Settlement Amount", "Settlement Date", "Contract Date"],
                ...settledLoans.map((entry) => [
                    entry.client_firstname + " " + entry.client_lastname,
                    entry.client_phone,
                    entry.organization_name,
                    entry.status,
                    entry.amount,
                    entry.interest_percentage,
                    entry.outright_settlement_amount,
                    entry.outright_settlement_date,
                    entry.contract_date
                ]),
            ];

            const ws = XLSX.utils.aoa_to_sheet(wsData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Outright Settlements Report');
            XLSX.writeFile(wb, 'outright_settlements_report.xlsx');
        } else if (table == 3) {
            const wsData = [
                ["Client Name", "Phone", "Organization", "Status", "Amount", "Arrears Charged", "Arrears P/M", "Arrears Due", "Arrears A/D", "Contract Date", "Due Date"],
                ...arrears.map((entry) => [
                    entry.client_firstname + " " + entry.client_lastname,
                    entry.client_phone,
                    entry.organization_name,
                    entry.status,
                    entry.amount,
                    entry.arrears_charged,
                    entry.arrears_pm,
                    entry.arrears_due,
                    entry.arrears_ad,
                    entry.contract_date,
                    entry.due_date
                ]),
            ];

            const ws = XLSX.utils.aoa_to_sheet(wsData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Arrears Report');
            XLSX.writeFile(wb, 'arrears_report.xlsx');
        } else if (table == 4) {
            const wsData = [
                ["Client Name", "Phone", "Organization", "Status", "Amount", "Interest(%)", "Settlement Amount", "Settlement Date", "Arrears Charged", "Arrears P/M", "Arrears Due", "Arrears A/D", "Contract Date", "Due Date"],
                ...consolidated.map((entry) => [
                    entry.client_firstname + " " + entry.client_lastname,
                    entry.client_phone,
                    entry.organization_name,
                    entry.status,
                    entry.amount,
                    entry.interest_percentage,
                    entry.outright_settlement_amount,
                    entry.outright_settlement_date,
                    entry.arrears_charged,
                    entry.arrears_pm,
                    entry.arrears_due,
                    entry.arrears_ad,
                    entry.contract_date,
                    entry.due_date
                ]),
            ];

            const ws = XLSX.utils.aoa_to_sheet(wsData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Consolidated Report');
            XLSX.writeFile(wb, 'consolidated_report.xlsx');
        }

    };

    return (
        <div className="mt-12 mb-8 flex flex-col gap-2">
            <Card>
                <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
                    <div className='flex justify-between lg:grid-cols-2  w-100'>
                        <Typography variant="h6" color="white">
                            Reports
                        </Typography>
                        <div className='flex gap-2'>
                            <Button color='white' ripple={true} variant='gradient' onClick={() => showTable(1)}>
                                New Loans
                            </Button>
                            <Button color='white' ripple={true} variant='gradient' onClick={() => showTable(2)}>
                                Outright Settlements
                            </Button>
                            <Button color='white' ripple={true} variant='gradient' onClick={() => showTable(3)}>
                                Arrears
                            </Button>
                            <Button color='white' ripple={true} variant='gradient' onClick={() => showTable(4)}>
                                Consolidated
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    {/* New loans */}
                    {currentTable === 1 && (
                        <div>
                            <div className='grid lg:grid-cols-2 lg:space-x-24 lg:gap-24  w-100'>
                                <Typography className="px-6" variant="h4" color="gray">
                                    New Loans Report
                                </Typography>
                                <div className='flex lg:justify-end lg:px-12'>
                                    <Button onClick={handleExportToExcel} color='green' ripple={true} variant='gradient'>
                                        Export to Excel
                                    </Button>
                                </div>
                            </div>
                            <table className="w-full min-w-[640px] table-auto">
                                <thead>
                                    <tr>
                                        {["Client Name", "Email", "Phone", "Organization", "Status", "Amount", "Interest(%)", "Contract Date", "Due Date", " "].map((el) => (
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
                                    {newLoans.map((loan) => {
                                        const className = `py-3 px-5 ${newLoans.length - 1
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
                                                        {loan.interest_percentage}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.contract_date.slice(0, 10)}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.due_date}
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

                    )}
                    {/* Outright Settlements */}
                    {currentTable === 2 && (
                        <div>
                            <div className='grid lg:grid-cols-2 lg:space-x-24 lg:gap-24  w-100'>
                                <Typography className="px-6" variant="h4" color="gray">
                                    Outright Settlement Report
                                </Typography>
                                <div className='flex lg:justify-end lg:px-12'>
                                    <Button onClick={handleExportToExcel} color='green' ripple={true} variant='gradient'>
                                        Export to Excel
                                    </Button>
                                </div>
                            </div>
                            <table className="w-full min-w-[640px] table-auto">
                                <thead>
                                    <tr>
                                        {["Client Name", "Phone", "Organization", "Status", "Amount", "Interest(%)", "Settlement Amount", "Settlement Date", "Contract Date", " "].map((el) => (
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
                                    {settledLoans.map((loan) => {
                                        const className = `py-3 px-5 ${settledLoans.length - 1
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
                                                        {loan.interest_percentage}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.outright_settlement_amount}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.outright_settlement_date.slice(0, 10)}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.contract_date.slice(0, 10)}
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
                    )}
                    {/* Arrears */}
                    {currentTable === 3 && (
                        <div>
                            <div className='grid lg:grid-cols-2 lg:space-x-24 lg:gap-24  w-100'>
                                <Typography className="px-6" variant="h4" color="gray">
                                    Arrears Report
                                </Typography>
                                <div className='flex lg:justify-end lg:px-12'>
                                    <Button onClick={handleExportToExcel} color='green' ripple={true} variant='gradient'>
                                        Export to Excel
                                    </Button>
                                </div>
                            </div>
                            <table className="w-full min-w-[640px] table-auto">
                                <thead>
                                    <tr>
                                        {["Client Name", "Phone", "Organization", "Status", "Amount", "Arrears Charged", "Arrears P/M", "Arrears Due", "Arrears A/D", "Contract Date", "Due Date", " "].map((el) => (
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
                                    {arrears.map((loan) => {
                                        const className = `py-3 px-5 ${arrears.length - 1
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
                                                        {loan.arrears_charged}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.arrears_pm}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.arrears_due}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.arrears_ad}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.due_date.slice(0, 10)}
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
                    )}
                    {/* Consolidated */}
                    {currentTable === 4 && (
                        <div>
                            <div className='grid lg:grid-cols-2 lg:space-x-24 lg:gap-24  w-100'>
                                <Typography className="px-6" variant="h4" color="gray">
                                    Consolidated Report
                                </Typography>
                                <div className='flex lg:justify-end lg:px-12'>
                                    <Button onClick={handleExportToExcel} color='green' ripple={true} variant='gradient'>
                                        Export to Excel
                                    </Button>
                                </div>
                            </div>
                            <table className="w-full min-w-[640px] table-auto">
                                <thead>
                                    <tr>
                                        {["Client Name", "Email", "Phone", "Organization", "Status", "Amount", "Interest(%)", "Contract Date", "Due Date", " "].map((el) => (
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
                                    {consolidated.map((loan) => {
                                        const className = `py-3 px-5 ${consolidated.length - 1
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
                                                        {loan.interest_percentage}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.contract_date.slice(0, 10)}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.due_date}
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
                    )}

                </CardBody>
            </Card>
            
        </div>
    );
};

export default Reports;
