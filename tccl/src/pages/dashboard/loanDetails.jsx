import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';
import { Link, useLocation } from "react-router-dom";
import * as XLSX from 'xlsx';
import Modal from 'react-modal';
import {
    Card,
    CardBody,
    Avatar,
    Typography,
    Button,
    Input

} from "@material-tailwind/react";


export function LoanDetails() {

    const API_URL = import.meta.env.VITE_API_URL;

    const [showModal, setShowModal] = useState(false);
    const [loan, setLoan] = useState([]);
    const [payments, setPayments] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [totalCollectible, settotalCollectible] = useState('')
    const [totalPaid, settotalPaid] = useState('')
    const [settlementAmount, setSettlementAmount] = useState('')
    const [monthsLeft, setMonthsLeft] = useState(0);

    const [paymentData, setPaymentData] = useState({
        amount: ""
    });

    const [topUpData, settopUpData] = useState({
        amount: 0,
        cycle: 0
    });

    const [settleData, setSettleData] = useState({
        outright_settlement: 1,
        outright_settlement_amount: 0,
        outright_settlement_date: "",
    });

    const [arrearData, setArrearData] = useState({
        arrears_charged: "",
        arrears_pm: "",
        arrears_due: "",
        arrears_ad: ""
    });

    //Handle input change for payment data
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPaymentData({
            ...paymentData,
            [name]: value,
        });
    };

    const settleInputChange = (e) => {
        const { name, value } = e.target;
        setSettleData({
            ...settleData,
            [name]: value,
        });
    };

    const arrearInputChange = (e) => {
        const { name, value } = e.target;
        setArrearData({
            ...arrearData,
            [name]: value,
        });
    };

    const topUpInputChange = (e) => {
        const { name, value } = e.target;
        settopUpData({
            ...topUpData,
            [name]: value,
        });
    };

    // Payments form submit
    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Create an object to send to your API
        const postData = {
            amount: paymentData.amount,
            loan_id: loanId
        };

        console.log(postData)

        // Send a POST request to your API to save the bank data
        axios.post(`${API_URL}/payments`, postData)
            .then((response) => {
                // Handle success, e.g., show a success message or reset the form
                console.log(`payment details added`)
            })
            .catch((error) => {
                console.error('Error posting payment data:', error);
                // Handle error, e.g., show an error message
            });
    };

    // Settlement Form
    const settleFormSubmit = (e) => {
        e.preventDefault();
        setShowModal(true);

    };

    const confirmSettle = () => {

        const date = new Date();

        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        let currentDate = `${year}-${month}-${day}`;
        console.log(currentDate);

        // Create an object to send to your API
        const postData = {
            outright_settlement: settleData.outright_settlement,
            outright_settlement_amount: settleData.outright_settlement_amount,
            outright_settlement_date: currentDate
        };

        const postPayment = {
            amount: settleData.outright_settlement_amount,
            loan_id: loanId
        }

        console.log(postData)

        // Send a POST request to your API to save the bank data
        axios.put(`${API_URL}/loans/${loanId}`, postData)
            .then((response) => {
                // Handle success, e.g., show a success message or reset the form
                // console.log(`Loan has been settled added: ${response}`)
                axios.post(`${API_URL}/payments`, postPayment)
                    .then((response) => {
                        // Handle success, e.g., show a success message or reset the form
                        console.log(`settlement payment details added`)
                    })
                    .catch((error) => {
                        console.error('Error posting payment data:', error);
                        // Handle error, e.g., show an error message
                    });
            })
            .catch((error) => {
                console.error('Error settling loan:', error);
                // Handle error, e.g., show an error message
            });

        setShowModal(false); // Close the modal after confirmation
    };

    const arrearFormSubmit = (e) => {
        e.preventDefault();

        const date = new Date();

        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        let currentDate = `${day}-${month}-${year}`;
        console.log(currentDate);

        // Create an object to send to your API
        const postData = {
            loanID: loanId,
            arrears_charged: arrearData.arrears_charged,
            arrears_pm: arrearData.arrears_pm,
            arrears_due: arrearData.arrears_due,
            arrears_ad: arrearData.arrears_ad,
            has_arrears: 1
        };

        console.log(postData)

        // Send a POST request to your API to save the bank data
        axios.put(`${API_URL}/loans/${loanId}`, postData)
            .then((response) => {
                // Handle success, e.g., show a success message or reset the form
                console.log(`Loan Arrears have been added: ${response}`)
            })
            .catch((error) => {
                console.error('Error settling loan:', error);
                // Handle error, e.g., show an error message
            });
    };

    const topUpFormSubmit = (e) => {
        e.preventDefault();

        let newamount = parseFloat(settlementAmount) + parseFloat(topUpData.amount)
        let newcycle = monthsLeft + parseInt(topUpData.cycle)

        // Create an object to send to your API
        const postData = {
            amount: newamount,
            cycle: newcycle,
            is_topup: 1,
            loan_topped_up: loanId,
            initial_amount: parseFloat(settlementAmount),
            topup_amount: parseFloat(topUpData.amount),
            clientID: loan.clientID,
            bankID: loan.bankID,
            organizationID: loan.organizationID,
            interest_percentage: loan.interest_percentage,
            statusID: 1,
            payslip_url1: loan.payslip_url1,
            payslip_url2: loan.payslip_url2
        };

        const updateData = {
            statusID: 5
        }

        console.log(postData)

        // Send a POST request to your API to save the bank data
        axios.put(`${API_URL}/loans/${loanId}`, updateData)
            .then((response) => {
                // Handle success, e.g., show a success message or reset the form
                console.log(`Initial loan has been updated`)
                axios.post(`${API_URL}/loans/topup`, postData)
                    .then((response) => {
                        // Handle success, e.g., show a success message or reset the form
                        console.log(`Top Up loan has been created`)
                    })
                    .catch((error) => {
                        console.error('Error creating top up data:', error);
                        // Handle error, e.g., show an error message
                    });
            })
            .catch((error) => {
                console.error('Top up loan could not be created:', error);
                // Handle error, e.g., show an error message
            });
    };

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const loanId = queryParams.get('loan_id');
    let totalCollect = 0;
    let totalPay = 0;

    // Format date
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    //Reformat date created
    const dateCreated = loan.created
    const parsedCreated = new Date(dateCreated)
    const formattedCreated = formatDate(parsedCreated)

    useEffect(() => {
        // Fetch payments from the API using axios
        axios.get(`${API_URL}/payments/${loanId}`)
            .then(response => {
                setPayments(response.data);
            })
            .catch(error => {
                console.error('Error fetching payments:', error);
            });
    }, [loanId]);


    //Calculate Amortization
    const monthlyInterestRate = loan.interest_percentage / 12 / 100;
    const monthlyPayment = (loan.amount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -loan.cycle));
    let remainingBalance = loan.amount;

    useEffect(() => {
        const newSchedule = [];
        let cumulativePayment = 0;



        let openingBalanaceInterest = 0;


        for (let i = 0; i < loan.cycle; i++) {
            const interestPayment = remainingBalance * monthlyInterestRate;
            const principalPayment = monthlyPayment - interestPayment;

            let principalPaid = 0
            // let closingBalance = 0;
            let variance = '-';
            let interestPaid = '-';
            let closingBalanceInterest = 0
            let outstandingBalance = 0;

            const date = new Date(loan.contract_date);
            date.setMonth(date.getMonth() + i + 1);
            date.setDate(0);

            const openingBalance = remainingBalance;
            remainingBalance -= principalPayment;
            let closingBalance = remainingBalance;

            // Check if there is a payment for the current month
            const paymentAmount = payments[i];

            if (paymentAmount) {

                variance = monthlyPayment - paymentAmount.amount;

                if (paymentAmount.amount > (openingBalanaceInterest + interestPayment)) {
                    interestPaid = parseFloat(openingBalanaceInterest + interestPayment)
                } else {
                    interestPaid = parseFloat(paymentAmount.amount)
                    closingBalanceInterest = (openingBalanaceInterest + interestPayment) - interestPaid
                    interestPaid = paymentAmount.amount
                }

                const remainingPayment = paymentAmount.amount - interestPaid;
                principalPaid = remainingPayment > 0 ? remainingPayment : 0;

            }

            cumulativePayment += paymentAmount ? paymentAmount.amount : 0;
            outstandingBalance = parseFloat(closingBalance + closingBalanceInterest)

            newSchedule.push({
                date: date,
                payment: monthlyPayment.toFixed(2),
                principal: principalPaid.toFixed(2),
                interest: interestPayment.toFixed(2),
                openingBalance: openingBalance.toFixed(2),
                closingBalance: closingBalance.toFixed(2),
                paymentAmount: paymentAmount ? parseFloat(paymentAmount.amount) : 0,
                cumulativePayment: cumulativePayment.toFixed(2),
                variance: paymentAmount ? parseFloat(variance).toFixed(2) : "-",
                openingBalanaceInterest: openingBalanaceInterest.toFixed(2),
                interestPaid: paymentAmount ? parseFloat(interestPaid).toFixed(2) : "-",
                closingBalanceInterest: closingBalanceInterest.toFixed(2),
                outstandingBalance: outstandingBalance.toFixed(2)

            });
            openingBalanaceInterest = closingBalanceInterest;
        }

        setSchedule(newSchedule);

        // Find the last closing balance where paymentAmount is not null
        let settleAmount = 0;
        for (let i = newSchedule.length - 1; i >= 0; i--) {
            if (newSchedule[i].paymentAmount !== 0) {
                settleAmount = parseFloat(newSchedule[i].outstandingBalance.replace(/[^0-9.-]+/g, ''));
                break;
            }
        }
        setSettlementAmount(settleAmount.toFixed(2))

        // Calculate total collectible, total amount paid and number of months left
        let nullPaymentCount = 0;
        for (let i = 0; i < newSchedule.length; i++) {
            totalCollect += parseFloat(newSchedule[i].payment.replace(/[^0-9.-]+/g, ''));
            totalPay += parseFloat(newSchedule[i].paymentAmount);
            if (newSchedule[i].paymentAmount === 0) {
                nullPaymentCount++;
            }
        }
        setMonthsLeft(nullPaymentCount);
        settotalCollectible(currencyFormatter.format(totalCollect))
        settotalPaid(totalPay)

    }, [loan.amount, loan.interest_percentage, loan.contract_date, loan.cycle, payments]);

    //Get loan Data
    useEffect(() => {
        // Make an HTTP request to fetch data from your API
        axios.get(`${API_URL}/loans/loan/${loanId}`)
            .then((response) => {
                setLoan(response.data[0]);
            })
            .catch((error) => {
                console.error('Error fetching loan details:', error);
            });
    }, []);

    // Create a currency formatter
    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'ZMW' || 'ZMW', // Default to USD if no currency is provided
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    //Export to excel button 
    const handleExportToExcel = () => {
        const wsData = [
            ['Date', 'Payment', 'Principal', 'Interest', 'Opening Balance', 'Closing Balance'],
            ...schedule.map((entry) => [
                entry.date.toLocaleDateString(),
                entry.payment,
                entry.principal,
                entry.interest,
                entry.openingBalance,
                entry.closingBalance,
            ]),
        ];

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Amortization Schedule');
        XLSX.writeFile(wb, 'amortization_schedule.xlsx');
    };

    const photoUrl = `${API_URL}/files/${loan.client_photo}`
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
                                alt="profile-photo"
                                size="xl"
                                className="rounded-lg shadow-lg shadow-blue-gray-500/40"
                            />
                            <div>
                                <Typography variant="h5" color="blue-gray" className="mb-1">
                                    {loan.client_firstname + " " + loan.client_lastname}
                                </Typography>
                                <Typography
                                    variant="small"
                                    className="font-normal text-blue-gray-600"
                                >
                                    {loan.organization_name}
                                </Typography>
                            </div>
                        </div>
                    </div>
                    <div className="grid-cols-1 mb-12 grid px-4 lg:grid-cols-3 xl:grid-cols-3">
                        <div>
                            <Typography variant="h6" color="blue-gray" className="mb-3">
                                {loan.client_firstname + "'s "} Loan Details
                            </Typography>
                            <div className="flex flex-col gap-2">
                                <Typography className=" text-sm font-medium text-blue-gray-500">
                                    Contract Date : {loan.contract_date}
                                </Typography>
                                <Typography className=" text-sm font-medium text-blue-gray-500">
                                    Amount : {loan.amount}
                                </Typography>
                                <Typography className=" text-sm font-medium text-blue-gray-500">
                                    Total Collectible : {totalCollectible}
                                </Typography>
                                <Typography className="text-sm font-medium text-blue-gray-500">
                                    {`Interest (%) : ${loan.interest_percentage}`}
                                </Typography>
                                <Typography className=" text-sm font-medium text-blue-gray-500">
                                    Amount Paid : {totalPaid}
                                </Typography>
                                <Typography className=" text-sm font-medium text-blue-gray-500">
                                    Outright Settlement : {loan.outright_settlement_amount}
                                </Typography>
                                <Typography className=" text-sm font-medium text-blue-gray-500">
                                    Settlement Date : {loan.outright_settlement_date}
                                </Typography>
                                <Typography className=" text-sm font-medium text-blue-gray-500">
                                    Date Added : {formattedCreated}
                                </Typography>
                            </div>
                        </div>

                        {/* Loan update settings */}
                        <div className='border-solid border-2 p-4 mx-2'>
                            <Typography variant="h6" color="blue-gray" className="mb-3">
                                Add Monthly Payment
                            </Typography>
                            <form className="mt-6 grid grid-cols-1 gap-2 mr-6" onSubmit={handleFormSubmit}>
                                <Input name="amount" label="Add Payment" size="lg" onChange={handleInputChange} />
                                <div className="flex text-center col-span">
                                    <Button type="submit">Add Payment</Button>
                                </div>
                            </form>

                        </div>

                        {/* Loan update settings */}
                        <div className='border-solid border-2 p-4 mx-2'>
                            <Typography variant="h6" color="blue-gray" className="mb-3">
                                Add Top Up
                            </Typography>
                            <form className="mt-6 grid grid-cols-1 gap-2 mr-6" onSubmit={topUpFormSubmit}>
                                <Input name="amount" type='number' label="Top Up Amount" size="lg" onChange={topUpInputChange} />
                                <Input name="cycle" type='number' label="Number of months" size="lg" onChange={topUpInputChange} />
                                <div className="flex text-center w-100">
                                    <Button type="submit">Add Top Up</Button>
                                </div>
                            </form>

                        </div>
                    </div>
                    <div className="grid-cols-1 mb-12 grid px-4 lg:grid-cols-3 xl:grid-cols-3">
                        {/* Outright Settlemnt Amount */}
                        <div></div>
                        <div className='border-solid border-2 p-4 mx-2'>
                            <Typography variant="h6" color="blue-gray" className="mb-3">
                                Outright Settlement
                            </Typography>
                            <form className="mt-6 grid grid-cols-1 gap-2 mr-6" onSubmit={settleFormSubmit}>
                                <Input name="outright_settlement_amount" type='number' value={settlementAmount} label="Amount" size="lg" onChange={settleInputChange} />

                                <div className="flex text-center w-100">
                                    <Button type="submit">Settle Loan</Button>
                                </div>
                            </form>
                            {/* Modal to confirm settling the loan */}
                            <div className="bg-white rounded-lg p-6 max-w-xs">
                                <Modal
                                    isOpen={showModal}
                                    onRequestClose={() => setShowModal(false)}
                                    style={{
                                        overlay: {
                                            position: 'fixed',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            // backgroundColor: 'rgba(35, 255, 255, 0.75)'
                                        },
                                        content: {
                                            position: 'fixed',
                                            top: '40px',
                                            left: '540px',
                                            right: '540px',
                                            bottom: '400px',
                                            border: '1px solid #ccc',
                                            background: '#fff',
                                            overflow: 'auto',
                                            WebkitOverflowScrolling: 'touch',
                                            borderRadius: '4px',
                                            outline: 'none',
                                            padding: '20px'
                                        }
                                    }}
                                >
                                    <div className="bg-white rounded-lg p-6 mx-auto max-w-xs">
                                        <h2 className="text-lg font-bold mb-4">Confirm Settling Loan</h2>
                                        <p className="mb-4">Are you sure you want to settle the loan?</p>
                                        <div className="flex justify-between">
                                            <button
                                                onClick={confirmSettle}
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                                            >
                                                Yes, Settle
                                            </button>
                                            <button
                                                onClick={() => setShowModal(false)}
                                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </Modal>
                            </div>
                        </div>
                        <div className='border-solid border-2 p-4 mx-2'>
                            <Typography variant="h6" color="blue-gray" className="mb-3">
                                Add Arrears
                            </Typography>
                            <form className="mt-6 grid grid-cols-1 gap-2 mr-6" onSubmit={arrearFormSubmit}>
                                <Input name="arrears_charged" type='number' label="Arrears Charged" size="lg" onChange={arrearInputChange} />
                                <Input name="arrears_pm" type='number' label="Arrears P/M" size="lg" onChange={arrearInputChange} />
                                <Input name="arrears_due" type='number' label="Arrears Due" size="lg" onChange={arrearInputChange} />
                                <Input name="arrears_ad" type='number' label="Arrears Due" size="lg" onChange={arrearInputChange} />
                                <div className="flex text-center w-100">
                                    <Button type="submit">Add Arrears</Button>
                                </div>
                            </form>

                        </div>
                    </div>
                    <hr className='my-4' />
                    <div className='grid lg:grid-cols-2 lg:space-x-24 lg:gap-24  w-100'>
                        <Typography className="px-6" variant="h4" color="gray">
                            Amortization Schedule
                        </Typography>
                        <div className='flex lg:justify-end lg:px-12'>
                            <Button onClick={handleExportToExcel} color='green' ripple={true} variant='gradient'>
                                Export to Excel
                            </Button>
                        </div>
                    </div>
                    <hr className='my-4' />
                    <div className='overflow-x-scroll'>
                        <table className='w-full min-w-[640px] table-auto'>
                            <thead>
                                <tr>
                                    <th className="border-b border-blue-gray-50 py-3 px-5 text-left text-sm">Date</th>
                                    <th className="border-b border-blue-gray-50 py-3 px-5 text-left text-sm">Expected Payment</th>
                                    <th className="border-b border-blue-gray-50 py-3 px-5 text-left text-sm">Actual Payment</th>
                                    <th className="border-b border-blue-gray-50 py-3 px-5 text-left text-sm">Variance</th>
                                    <th className="border-b border-blue-gray-50 py-3 px-5 text-left text-sm">O/B Capital</th>
                                    <th className="border-b border-blue-gray-50 py-3 px-5 text-left text-sm">Capital Payment</th>
                                    <th className="border-b border-blue-gray-50 py-3 px-5 text-left text-sm">C/B Capital</th>
                                    <th className="border-b border-blue-gray-50 py-3 px-5 text-left text-sm">O/B Interest</th>
                                    <th className="border-b border-blue-gray-50 py-3 px-5 text-left text-sm">Interest Raised</th>
                                    <th className="border-b border-blue-gray-50 py-3 px-5 text-left text-sm">Interest Payment</th>
                                    <th className="border-b border-blue-gray-50 py-3 px-5 text-left text-sm">C/B Interest</th>
                                    <th className="border-b border-blue-gray-50 py-3 px-5 text-left text-sm">Outstanding Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedule.map((entry) => (
                                    <tr key={entry.date.toISOString()}>
                                        <td className='py-3 px-5 border-b border-blue-gray-50 text-xs'>{entry.date.toLocaleDateString()}</td>
                                        <td className='py-3 px-5 border-b border-blue-gray-50 text-xs'>{entry.payment}</td>
                                        <td className='py-3 px-5 border-b border-blue-gray-50 text-xs'>{entry.paymentAmount}</td>
                                        <td className='py-3 px-5 border-b border-blue-gray-50 text-xs'>{entry.variance}</td>
                                        <td className='py-3 px-5 border-b border-blue-gray-50 text-xs'>{entry.openingBalance}</td>
                                        <td className='py-3 px-5 border-b border-blue-gray-50 text-xs'>{entry.principal}</td>
                                        <td className='py-3 px-5 border-b border-blue-gray-50 text-xs'>{entry.closingBalance}</td>
                                        <td className='py-3 px-5 border-b border-blue-gray-50 text-xs'>{entry.openingBalanaceInterest}</td>
                                        <td className='py-3 px-5 border-b border-blue-gray-50 text-xs'>{entry.interest}</td>
                                        <td className='py-3 px-5 border-b border-blue-gray-50 text-xs'>{entry.interestPaid}</td>
                                        <td className='py-3 px-5 border-b border-blue-gray-50 text-xs'>{entry.closingBalanceInterest}</td>
                                        <td className='py-3 px-5 border-b border-blue-gray-50 text-xs'>{entry.outstandingBalance}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>
        </>
    );
}
export default LoanDetails;