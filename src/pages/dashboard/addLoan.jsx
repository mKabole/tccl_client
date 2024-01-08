import React, { useEffect, useState } from "react";
import axios from "axios";
import Datepicker from "react-tailwindcss-datepicker";
import { Link, useAsyncError, useNavigate } from "react-router-dom";
import HTMLToWord from "@/widgets/layout/HTMLToWord";
import Modal from 'react-modal';
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


    const [settlementAmount, setSettlementAmount] = useState('')
    const [monthsLeft, setMonthsLeft] = useState(0);
    const [totalPaid, settotalPaid] = useState(0)

    const [totalCollectible, settotalCollectible] = useState(0)
    const [expectedDeduction, setExpectedDeduction] = useState(0)

    const [contract, setContract] = useState('');
    const [showModal, setShowModal] = useState(false);

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

    const [payments, setPayments] = useState([]);
    const [schedule, setSchedule] = useState([]);

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
        interest_percentage: 60,
        cycle: ""
    });

    const user_id = localStorage.getItem("user_id");

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

        setContract(
            `
            <div>
                <p>This Agreement made the …………………………day of…………………………………….2023 between:
                    <ol>
                        <li>
                            <strong>TRANSPARENT CHARTERED CREDIT LIMITED</strong> a company registered in accordance with the laws
                            of Zambia and having its registered office in Lusaka (Hereinafter referred to as the “Lender”)
                            of the one part <strong>AND</strong>
                        </li>
                        <li>…………………………………………………………of………………………………………………………… currently in active employment at
                            ….……………………………………...…… (Hereinafter referred to asthe “Borrower”)
                        </li>
                    </ol>
                </p>
                <p>
                    <strong>WHEREAS:</strong>
                    <ol type="i">
                        <li>The Lender is a duly registered money lending institution and is in the business of lending money, inter alia;</li>
                        <li>The Borrower desires to loan certain monies from the Lender; and</li>
                        <li>In consideration of the Lender loaning certain monies to the Borrower, and the Borrower repaying the 
                            Loan to the Lender, both parties agree to keep, perform and fulfill the promises and conditions set 
                            out in this Agreement
                        </li>
                    </ol>
                </p>
                <p>
                    IT IS HEREBY AGREED AS FOLLOWS:
                    <ol>
                        <li>
                            <strong>CONDITIONS PRECEDENT</strong><br>
                            <ul>
                                <li>
                                    1.1 All the provisions of this Agreement shall be subject to the fulfilment 
                                    of the following conditions precedent: <br>
                                    <ul>
                                        <li>
                                            1.1.1 that the Borrower produces two latest certified copies of the Borrowers pay slips to the Lender
                                            immediately upon execution of this Agreement; and
                                        </li>
                                        <li>
                                            1.1.2 that the Borrower produces a National Registration Card or valid Driver’s License to the Lender
                                            immediately upon execution of this Agreement.
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    1.2 The conditions precedent in clause 1.1 and 1.2 above are for the benefit of the Lender alone and may be
                                    waived by the Lender.
                                </li>
                                <li>
                                    1.3 If any one of the Conditions Precedent referred to in clause 1.1.1 and 1.1.2 above is not fulfilled, then this
                                    Agreement shall not take effect.
                                </li>
                            </ul>
                        </li>
                        <li><strong>LOAN AMOUNT</strong><br>
                            <ul>
                                <li>
                                    2.1 The Lender shall, on execution of this Agreement, and upon satisfaction of Clause 1 above, lend to the
                                    Borrower the sum of ZMW…………………………………..(amount in words)
                                    …………………………………………………………………………………………………….…… (“Borrowed Amount”)
                                </li>
                            </ul>
                        </li>
                        <li>
                            <strong>INTEREST RATE</strong><br>
                            <ul>
                                <li>
                                    3.1 The borrowed Amount shall accrue interest at the rate of 8.3% compounded monthly and calculated on a
                                    reducing balance basis for a period of ………………………. months.
                                </li>
                            </ul>
                        </li>
                        <li>
                            <strong>TERM AND PAYMENT SCHEDULE</strong><br>
                            <ul>
                                <li>
                                    4.1 The Borrowed Amount, including the interest accrued shall be due and payable on the 
                                </li>
                                <li>
                                    4.2 ……………………… day of ………………………… 20…… (“Due Date”)
                                </li>
                                <li>
                                    4.3 The Borrower agrees to repay the Borrowed Amount to the Lender in ……………………….. monthly installments of 
                                    ZMW …………………………………. (amount in words) …………………..……………………………………………………..…………………………………
                                    each payable on the …………… of each month (hereinafter referred to as the “Payment Schedule”)
                                </li>
                                <li>
                                    4.4 Notwithstanding, the Borrower is at liberty to liquidate the Borrowed Amount, including the interest in
                                    such larger installments than described in the Payment Schedule, and in such situations, the interest will be
                                    calculated on pro rata basis
                                </li>
                            </ul>
                        </li>
                        <li>
                            <strong>AMOUNT PAYABLE</strong><br>
                            <ul>
                                <li>
                                    5.1 Upon expiration of the term described in Clause 4.1 above, the total sum payable by the Borrower to the
                                    Lender shall be ZMW …………………………………………… (Amount in words)
                                    ……….…………………………………………………………………………… (“Amount Payable”)
                                </li>
                                <li>
                                    5.2 The Amount Payable is subject to change based on the payments made by the Borrower as stipulated in
                                    Clause 4.3 above
                                </li>
                            </ul>
                        </li>
                        <li>
                            <strong>REMEDIES</strong><br>
                            <ul>
                                <li>
                                    6.1 No delay or omission on the part of the Lender in exercising any right hereunder shall operate as a waiver
                                    of any such right or of any other right of such Lender, nor shall any delay, omission, or waiver on any one
                                    occasion be deemed a bar to or waiver of the same or any other right on any future occasion. The rights
                                    and remedies of the Lender shall be cumulative and may be pursued singly, successively, or together, at the sole discretion of the Lender
                                </li>
                            </ul>
                        </li>
                        <li>
                            <strong>ACCELERATION</strong><br>
                            <ul>
                                <li>
                                    7.1 The Lender shall have the right to declare the Borrowed Amount to be immediately due and payable,
                                    including interest owed, if any of the events are to occur: <br>
                                    <ol type="a">
                                        <li>
                                            Late Payment: If any payment is late that is due under the Payment Schedule for more than 14
                                            days; or
                                        </li>
                                        <li>
                                            Default: If the Borrower should default on any of the conditions of this Agreement.
                                        </li>
                                    </ol>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <strong>DEFAULT</strong><br>
                            <ul>
                                <li>
                                    8.1 In the event of any default or breach of the Agreement by the Borrower, the full amounts of the loan then
                                    outstanding, together with all interest accrued thereon and any other amount or charges payable or
                                    outstanding in terms of these facilities shall become immediately due for payment, failure to which, the
                                    Lender reserves the right to seek legal redress for the repayment of the amount due under this agreement.
                                </li>
                                <li>
                                    8.2 All costs, expenses and expenditures incurred by enforcing this Agreement as a result of any default by the
                                    Borrower, will be added to the principal then outstanding and will immediately be paid by the Borrower.
                                </li>
                            </ul>
                        </li>
                        <li>
                            <strong>SEVERABILITY</strong><br>
                            <ul>
                                <li>
                                    9.1 If any provision of this Agreement or the application thereof shall, for any reason and to any extent, be
                                    invalid or unenforceable, neither the remainder of this Agreement nor the application of the provision to other persons, entities, or circumstances shall be affected, thereby, but instead shall be enforced to the
                                    maximum extent permitted by law
                                </li>
                            </ul>
                        </li>
                        <li>
                            <strong>TERMINATION</strong><br>
                            <ul>
                                <li>
                                    10.1 This Agreement automatically terminates on repayment of the amount due under this agreement 
                                    pursuant to the terms and conditions herein.
                                </li>
                            </ul>
                        </li>
                        <li>
                            <strong>AMENDMENT</strong><br>
                            <ul>
                                <li>
                                    11.1 No alteration, variation, amendment or purported consensual cancellation of this Agreement or any
                                    addition thereto or deletion there from shall be of any force or effect unless there is an agreement by both
                                    parties in writing.
                                </li>
                            </ul>
                        </li>
                        <li>
                            <strong>SUCCESSORS</strong><br>
                            <ul>
                                <li>
                                    12.1 This Agreement will pass to the benefit of the Lender and be binding upon the respective heirs, executors,
                                    administrators, successors and permitted assigns of the Borrower; provided, however, that the Parties may not assign any of its rights or delegate any of its obligations hereunder without the prior written consent of
                                    the Parties
                                </li>
                            </ul>
                        </li>
                        <li>
                            <strong>ENTIRE AGREEMENT</strong><br>
                            <ul>
                                <li>
                                    13.1 This Agreement contains all the terms agreed to by the parties relating to its subject matter, including any attachments or addendums. This Agreement replaces all previous discussions, understandings, and oral
                                    agreements. The Borrower and the Lender agree to the terms and conditions and shall be bound until the
                                    Borrowed Amount is repaid in full.
                                </li>
                            </ul>
                        </li>
                        <li>
                            <strong>GOVERNING LAW</strong><br>
                            <ul>
                                <li>
                                    14.1 This Agreement shall in all aspects be governed by and construed in accordance with the laws of the
                                    Republic of Zambia
                                </li>
                            </ul>
                        </li>
                        <li>
                            <strong>DISPUTE RESOLUTION</strong>
                            <ul>
                                <li>
                                    15.1 Any disputes in connection with the interpretation or implementation of this Agreement shall be resolved
                                    through the Zambian Courts
                                </li>
                            </ul>
                        </li>
                    </ol>
                    IN WITNESS WHEREOF, the Lender and the Borrower have executed this Agreement as of the day and year first above
                    written
                </p>
                <p>
                    <strong>LENDER</strong>
                    <ul>
                        <li>
                            Authorized Signature: .................................
                        </li>
                        <li>
                            Print Name and Title: .................................
                        </li>
                        <li>
                            Witness Signature: ...................................
                        </li>
                        <li>
                            Name: ................................................
                        </li>
                    </ul>
                </p>
        
                <p>
                    <strong>BORROWER</strong>
                    <ul>
                        <li>
                            Authorized Signature: .................................
                        </li>
                        <li>
                            Print Name: ...........................................
                        </li>
                        <li>
                            Next of Kin: .........................................
                        </li>
                        <li>
                            Phone No: ..............................................
                        </li>
                    </ul>
                </p>
        
            </div>
            `
        )
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
        setShowModal(true);

    };

    //Calculate Amortization




    const confirmContract = () => {
        const formData = new FormData();

        
        const monthlyInterestRate = loanData.interest_percentage / 12 / 100;
        const monthlyPayment = (loanData.amount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -loanData.cycle));

        console.log(monthlyPayment)

        let remainingBalance = loanData.amount;
        let totalCollect = 0;
        let totalPay = 0;

        const newSchedule = [];
        let cumulativePayment = 0;
        let openingBalanaceInterest = 0;
        let openingBalance = 0
        let interestPayment = 0
        let arrears_pm1 = 0
        let arrears_pm2 = 0

        setExpectedDeduction(monthlyPayment)


        for (let i = 0; i < loanData.cycle; i++) {

            const principalPayment = monthlyPayment - interestPayment;

            let principalPaid = 0
            let closingBalance = 0;
            let variance = 0;
            let interestPaid = 0;
            let closingBalanceInterest = 0
            let outstandingBalance = 0;

            const date = new Date(loanData.contract_date);
            date.setMonth(date.getMonth() + i + 1);
            date.setDate(0);

            if (i === 0) {
                openingBalance = remainingBalance;
                interestPayment = remainingBalance * monthlyInterestRate;
            }

            const paymentAmount = payments[i];


            if (paymentAmount) {
                console.log("payment amount", payments[i])

                variance = monthlyPayment - paymentAmount.amount;
                interestPayment = openingBalance * monthlyInterestRate

                if (paymentAmount.amount > (openingBalanaceInterest + interestPayment)) {
                    interestPaid = parseFloat(openingBalanaceInterest + interestPayment)
                } else {
                    interestPaid = parseFloat(paymentAmount.amount)
                }

                const remainingPayment = paymentAmount.amount - interestPaid;
                // principalPaid = remainingPayment > 0 ? remainingPayment : 0;
                if (paymentAmount.amount - interestPaid > 0) {
                    principalPaid = paymentAmount.amount - interestPaid
                    // console.log(interestPaid)
                }

            }


            closingBalanceInterest = (openingBalanaceInterest + interestPayment) - interestPaid
            closingBalance = parseFloat(openingBalance - principalPaid)

            cumulativePayment += paymentAmount ? paymentAmount.amount : 0;
            outstandingBalance = parseFloat(closingBalance + closingBalanceInterest)

            const capitalRaised = calculatePPMT(loanData.amount, monthlyInterestRate, loanData.cycle, i + 1, loanData.amount)

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
                date: date,
                payment: monthlyPayment.toFixed(2),
                // principal: principalPaid.toFixed(2),
                // capitalRaised: capitalRaised.toFixed(2),
                // capitalOutstanding: capitalOutstanding.toFixed(2),
                // interest: interestPayment.toFixed(2),
                // openingBalance: openingBalance.toFixed(2),
                // closingBalance: closingBalance.toFixed(2),
                // paymentAmount: paymentAmount ? parseFloat(paymentAmount.amount) : 0,
                cumulativePayment: cumulativePayment.toFixed(2),
                // variance: paymentAmount ? parseFloat(variance).toFixed(2) : 0,
                openingBalanaceInterest: openingBalanaceInterest.toFixed(2),
                interestPaid: paymentAmount ? parseFloat(interestPaid).toFixed(2) : 0,
                closingBalanceInterest: closingBalanceInterest.toFixed(2),
                outstandingBalance: outstandingBalance.toFixed(2),
                arrears_pm1: arrears_pm1.toFixed(2),
                arrears_pm2: parseFloat(arrears_pm2).toFixed(2)

            });


            openingBalanaceInterest = closingBalanceInterest;
            openingBalance = closingBalance;
            arrears_pm1 = arrears_pm2
        }


        setSchedule(newSchedule);

        // Find the last closing balance where paymentAmount is not null
        let settleAmount = 0;
        for (let i = newSchedule.length - 1; i >= 0; i--) {
            if (newSchedule[i].paymentAmount !== 0) {
                settleAmount = parseFloat(newSchedule[i].outstandingBalance.replace(/[^0-9.-]+/g, ''));
                if (newSchedule[i].arrears_pm1 === 0) {

                }
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
        console.log("totalCollect", totalCollect)
        setMonthsLeft(nullPaymentCount);
        settotalCollectible(totalCollect)
        settotalPaid(totalPay.toFixed(2))



        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append("files", selectedFiles[i]);
        }

        axios.post(`${API_URL}/upload/multiple`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then((fileResponse) => {
                const urls = fileResponse.data; // Get an array of file URLs from the server

                // Include the file URLs in your data to be sent to the API
                const postData = {
                    userID: user_id,
                    contract_date: dateValue.startDate,
                    clientID: selectedClient,
                    organizationID: selectedOrganization,
                    bankID: selectedBank,
                    amount: loanData.amount,
                    interest_percentage: loanData.interest_percentage,
                    cycle: loanData.cycle,
                    payslip_url1: urls[0],
                    payslip_url2: urls[1],
                    statusID: 1,
                    total_collectible: totalCollect,
                    monthly_deduction: monthlyPayment
                };

                console.log(postData)

                // Send a POST request to your API with updated postData
                axios.post(`${API_URL}/loans`, postData)
                    .then((response) => {
                        // Handle success, e.g., show a success message or reset the form
                        alert(`Loan details and files uploaded`);
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
        setShowModal(false);
    }

    function calculatePPMT(loanAmount, monthlyInterestRate, periods, period, presentValue) {

        // Calculate the monthly payment
        let monthlyPayment = loanAmount * monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -periods));

        // Calculate the principal payment for the specified period
        let principalPayment = presentValue * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, period - 1) / (Math.pow(1 + monthlyInterestRate, periods) - 1);

        return principalPayment;
    }


    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
                    <Typography variant="h6" color="white">
                        Add New Loan
                    </Typography>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <form className="my-12 grid grid-cols-1 gap-6 lg:px-12" onSubmit={handleFormSubmit} >
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
                        {/* <Input name="interest_percentage" type="number" label="Interest (%)"
                            size="lg" onChange={handleInputChange} /> */}
                        <Input name="cycle" type="number" label="Loan Term (Number of Months)"
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
                    {/* Modal to show contract and Confirm loan */}
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
                                    left: '340px',
                                    right: '40px',
                                    bottom: '40px',
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
                            <div className="bg-white rounded-lg mx-auto">
                                <h2 className="text-lg font-bold mb-4">Loan Contract</h2>
                                <div dangerouslySetInnerHTML={{ __html: contract }} />
                                <div className="flex justify-between">
                                    <button
                                        onClick={confirmContract}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                                    >
                                        Create Loan
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
                </CardBody>
            </Card>
        </div>
    );
}

export default AddLoan;