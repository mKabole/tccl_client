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

    const [payments, setPayments] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [totalCollectible, settotalCollectible] = useState('')
    const [totalPaid, settotalPaid] = useState(0)
    const [settlementAmount, setSettlementAmount] = useState('')
    const [monthsLeft, setMonthsLeft] = useState(0);

    const [page, setPage] = useState(1);

    const showTable = (tableNumber) => {
        setCurrentTable(tableNumber === currentTable ? null : tableNumber);
    };

    // Get all new loans
    useEffect(() => {

        axios.get(`${API_URL}/loans/new`) // Replace with your actual API endpoint
            .then((response) => {
                setNewLoans(response.data);
                console.log(response.data)
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
            const htmlTable = document.querySelector('.newLoans-table'); // Select the table element
            const ws = XLSX.utils.table_to_sheet(htmlTable); // Convert table to worksheet
            const wb = XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            XLSX.writeFile(wb, 'new_loans_report.xlsx');

        } else if (table == 2) {
            const htmlTable = document.querySelector('.settlement-table'); // Select the table element
            const ws = XLSX.utils.table_to_sheet(htmlTable); // Convert table to worksheet
            const wb = XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            XLSX.writeFile(wb, 'outright_settlements_report.xlsx');
        } else if (table == 3) {
            const htmlTable = document.querySelector('.arrears-table'); // Select the table element
            const ws = XLSX.utils.table_to_sheet(htmlTable); // Convert table to worksheet
            const wb = XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            XLSX.writeFile(wb, 'arrears_report.xlsx');
        } else if (table == 4) {
            const htmlTable = document.querySelector('.consolidated-table'); // Select the table element
            const ws = XLSX.utils.table_to_sheet(htmlTable); // Convert table to worksheet
            const wb = XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            XLSX.writeFile(wb, 'consolidated_report.xlsx');
        }

    };

    function calculateAmortization(interestRate, loanAmount, numberOfPayments, startDate, loan_id) {

        axios.get(`${API_URL}/payments/${loan_id}`)
            .then(response => {
                setPayments(response.data[0]);
            })
            .catch(error => {
                console.error('Error fetching payments:', error);
            }
            );

        const monthlyInterestRate = interestRate / 100 / 12;
        const monthlyPayment = (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));
        let remainingBalance = loanAmount;

        let totalPrincipalPaid = 0;
        let totalInterestPaid = 0;
        let totalPaid = 0;

        const newSchedule = [];
        let cumulativePayment = 0;
        let openingBalanaceInterest = 0;
        let finalOpeningBalanceInterest = 0
        let openingBalance = 0
        let interestPayment = loanAmount * monthlyInterestRate;
        let arrears_pm1 = 0
        let arrears_pm2 = 0

        let variance = 0;
        let closingBalanceInterest = 0
        let finalClosingBalanceInterest = 0
        let finalOutstandingBalance = 0;
        let totalOutstandingBalance = 0;
        let finalArrears = 0;
        let cbCapital = 0


        let currentDate = new Date(startDate);

        for (let i = 0; i < numberOfPayments; i++) {

            const principalPayment = monthlyPayment - interestPayment;

            let interestPaid = 0;
            let principalPaid = 0
            let closingBalance = 0;
            let outstandingBalance = 0;

            if (i === 0) {
                openingBalance = remainingBalance;
                interestPayment = remainingBalance * monthlyInterestRate;
            }

            const paymentAmount = payments[i];

            if (paymentAmount) {

                variance = monthlyPayment - paymentAmount.amount;
                interestPayment = openingBalance * monthlyInterestRate

                if (paymentAmount.amount > (openingBalanaceInterest + interestPayment)) {
                    interestPaid = parseFloat(openingBalanaceInterest + interestPayment)
                } else {
                    interestPaid = parseFloat(paymentAmount.amount)
                }

                const remainingPayment = paymentAmount.amount - interestPaid;
                if (paymentAmount.amount - interestPaid > 0) {
                    principalPaid = paymentAmount.amount - interestPaid
                }

                totalPaid += paymentAmount.amount;
            }

            closingBalanceInterest = (openingBalanaceInterest + interestPayment) - interestPaid
            closingBalance = parseFloat(openingBalance - principalPaid)

            cumulativePayment += paymentAmount ? paymentAmount.amount : 0;
            outstandingBalance = parseFloat(closingBalance + closingBalanceInterest)

            const capitalRaised = calculatePPMT(loanAmount, interestRate, numberOfPayments, i + 1, loanAmount)

            let capitalOutstanding = 0

            if (capitalRaised - principalPaid > 0) {
                capitalOutstanding = capitalRaised - principalPaid
            }

            if (capitalOutstanding > 0) {
                arrears_pm1 = monthlyInterestRate * capitalOutstanding
                arrears_pm2 = arrears_pm2

                if (arrears_pm1 === 0) {
                    arrears_pm2 = arrears_pm1
                } else {
                    arrears_pm2 = arrears_pm1 + arrears_pm2;
                }
            }

            newSchedule.push({
                // date: date,
                payment: monthlyPayment.toFixed(2),
                principal: principalPaid.toFixed(2),
                capitalRaised: capitalRaised.toFixed(2),
                capitalOutstanding: capitalOutstanding.toFixed(2),
                interest: interestPayment.toFixed(2),
                openingBalance: openingBalance.toFixed(2),
                closingBalance: closingBalance.toFixed(2),
                paymentAmount: paymentAmount ? parseFloat(paymentAmount.amount) : 0,
                cumulativePayment: cumulativePayment.toFixed(2),
                variance: paymentAmount ? parseFloat(variance).toFixed(2) : 0,
                openingBalanaceInterest: openingBalanaceInterest.toFixed(2),
                interestPaid: paymentAmount ? parseFloat(interestPaid).toFixed(2) : 0,
                closingBalanceInterest: closingBalanceInterest.toFixed(2),
                outstandingBalance: outstandingBalance.toFixed(2),
                arrears_pm1: arrears_pm1.toFixed(2),
                arrears_pm2: parseFloat(arrears_pm2).toFixed(2)

            });

            totalInterestPaid += interestPaid;
            totalPrincipalPaid += principalPaid;
            loanAmount -= principalPayment;
            totalOutstandingBalance += outstandingBalance

            // Calculate the current date for each payment
            currentDate.setMonth(currentDate.getMonth() + 1);

            openingBalanaceInterest = closingBalanceInterest;
            openingBalance = closingBalance;
            arrears_pm1 = arrears_pm2
            cbCapital = closingBalance
        }

        let firstNullPaymentIndex = null;
        let firstNullPaymentData = null;

        for (let i = 0; i < newSchedule.length; i++) {
            if (newSchedule[i].paymentAmount === 0) { // Assuming paymentAmount is 0 for null payments
                firstNullPaymentIndex = i;
                firstNullPaymentData = newSchedule[i];
                break;
            }
        }

        if (firstNullPaymentIndex !== null) {
            const {
                closingBalanceInterest,
                openingBalanaceInterest,
                outstandingBalance,
                arrears_pm1,
            } = firstNullPaymentData;

            // Use these values or perform operations as needed

            finalClosingBalanceInterest = closingBalanceInterest
            finalOpeningBalanceInterest = openingBalanaceInterest
            finalOutstandingBalance = outstandingBalance
            finalArrears = arrears_pm1
        } else {
            // console.log('No null payment found in the schedule.');
        }


        const finalDate = currentDate.toLocaleDateString(); // Final date after all payments
        const totalInterestAmount = (totalInterestPaid - loanAmount).toFixed(2);

        return {
            totalPrincipalPaid: totalPrincipalPaid.toFixed(2),
            totalInterestPaid: totalInterestPaid.toFixed(2),
            totalInterestAmount: totalInterestAmount,
            totalPaid: totalPaid.toFixed(2),
            arrears: finalArrears,
            closingBalance: cbCapital,
            openingBalanace: openingBalance,
            openingBalanaceInterest: finalOpeningBalanceInterest,
            interestRaised: interestPayment.toFixed(2),
            closingBalanceInterest: finalClosingBalanceInterest,
            totalOutstandingBalance: finalOutstandingBalance,
            finalDate: finalDate
        };
    }

    function calculatePPMT(loanAmount, monthlyInterestRate, periods, period, presentValue) {

        // Calculate the monthly payment
        let monthlyPayment = loanAmount * monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -periods));

        // Calculate the principal payment for the specified period
        let principalPayment = presentValue * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, period - 1) / (Math.pow(1 + monthlyInterestRate, periods) - 1);

        return principalPayment;
    }

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

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
                            <table className="w-full min-w-[640px] table-auto newLoans-table">
                                <thead>
                                    <tr>
                                        {[
                                            "Loan Officer", "Contract Date", "Client Name", "NRC", "Organization", "Phone", "Employee Number",
                                            "Acc Number", "Amount", "Interest(%)", "Expected Deduction", "Total Collectible", "Status", "Loan Term",
                                            ""
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
                                                                {loan.user_firstname + " " + loan.user_lastname}
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.contract_date.slice(0, 10)}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.client_firstname + " " + loan.client_lastname}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.nrc}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.organization_name}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.client_phone}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.employee_no}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.account_no}
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
                                                        {loan.monthly_deduction.toFixed(2) + " /month"}
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
                                                        {loan.cycle}
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
                            <table className="w-full min-w-[640px] table-auto settlement-table">
                                <thead>
                                    <tr>
                                        {[
                                            "Contract Date", "Client Name", "NRC", "Organization", "Phone Number", "Employee No", "Acc No", "Loan Amount", "Interest(%)",
                                            "Capital Paid", "Interest Paid", "Total Collected", "Expected Deduction", "Loan Status", "Settlement Amount", "Loan Term", "Due Date",
                                            " "
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
                                    {settledLoans.map((loan) => {
                                        const result = calculateAmortization(loan.interest_percentage, loan.amount, loan.cycle, loan.contract_date, loan.id)
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
                                                                {loan.contract_date.slice(0, 10)}
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.client_firstname + " " + loan.client_lastname}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.nrc}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.organization_name}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.client_phone}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.employee_no}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.account_no}
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
                                                        {result.totalPrincipalPaid}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {result.totalInterestPaid}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {result.totalPaid}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.monthly_deduction.toFixed(2) + " /month"}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.status}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.outright_settlement_amount}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.cycle}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {result.finalDate}
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
                            <table className="w-full min-w-[640px] table-auto arrears-table">
                                <thead>
                                    <tr>
                                        {[
                                            "Contract Date", "Client Name", "NRC", "Organization", "Phone", "Amount", "Interest(%)", "Expected Deduction", "Actual Deduction",
                                            "C/B Capital", "Capital Payment", "Interest Paid", "Total Collectible", "Total Collected", "Arrears Amount", "Loan Status",
                                            "Loan Term", "Due Date", " "
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
                                    {arrears.map((loan) => {
                                        const result = calculateAmortization(loan.interest_percentage, loan.amount, loan.cycle, loan.contract_date, loan.id)
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
                                                                {loan.contract_date.slice(0, 10)}
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.client_firstname + " " + loan.client_lastname}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.nrc}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.organization_name}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.client_phone}
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
                                                        {loan.monthly_deduction + " /month"}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {result.totalPaid}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {result.closingBalance}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {result.totalPrincipalPaid}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {result.totalInterestPaid}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.total_collectible}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {result.totalPaid}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {result.arrears}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.status}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.cycle}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {result.finalDate.slice(0, 10)}
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
                            <table className="w-full min-w-[640px] table-auto consolidated-table">
                                <thead>
                                    <tr>
                                        {[
                                            "Loan Officer", "Contract Date", "Client Name", "NRC", "Organization", "Phone", "Email", "Age", "Amount", "Interest(%)", "Expected Deduction", "Actual Deduction",
                                            "Total O/B Capital", "O/B Interest", "Intrest Raised", "C/B Interest", "Total Balance Outstanding",
                                            "Acc No", "C/B Capital", "Capital Payment", "Interest Paid", "Total Collectible", "Total Collected", "Arrears Amount", "Loan Status",
                                            "Loan Term", "Due Date", " "
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
                                    {consolidated.map((loan) => {
                                        const dateOfBirth = loan.date_of_birth
                                        const parsedDate = new Date(dateOfBirth);
                                        const formattedDate = formatDate(parsedDate);
                                        const age = calculateAge(formattedDate)
                                        // console.log("age:", loan.date_of_birth)
                                        const result = calculateAmortization(loan.interest_percentage, loan.amount, loan.cycle, loan.contract_date, loan.id)
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
                                                                {loan.user_firstname + " " + loan.user_lastname}
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.contract_date.slice(0, 10)}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.client_firstname + " " + loan.client_lastname}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.nrc}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.organization_name}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.client_phone}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.client_mail}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {age}
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
                                                        {loan.monthly_deduction.toFixed(2) + " /month"}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {result.totalPaid}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {result.openingBalanace}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {result.openingBalanaceInterest}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {result.interestRaised}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {result.closingBalanceInterest}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {result.totalOutstandingBalance}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.account_no}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {result.totalOutstandingBalance}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {result.totalPrincipalPaid}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {result.totalInterestPaid}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.total_collectible.toFixed(2)}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {result.totalPaid}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {result.arrears}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.status}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {loan.cycle}
                                                    </Typography>
                                                </td>
                                                <td className={className}>
                                                    <Typography className="text-xs font-semibold text-blue-gray-600">
                                                        {result.finalDate}
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
