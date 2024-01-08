import {
	HomeIcon,
	UserCircleIcon,
	TableCellsIcon,
	BellIcon,
	ArrowRightOnRectangleIcon,
	UserPlusIcon,
	BuildingOfficeIcon,
	CurrencyDollarIcon,
	UserGroupIcon,
	BuildingLibraryIcon,
	ReceiptRefundIcon,
	ClipboardDocumentListIcon
} from "@heroicons/react/24/solid";

import
{ 
	Home, Profile, Tables, Notifications, AddClient, AddOrganization, AddLoan, Organizations,
	Clients, Loans, Banks, AddBank, ReceiptBatches, AddReceipt, Receipts, ClientDetails, LoanDetails, Reports
} from "@/pages/dashboard";

import { SignIn, SignUp } from "@/pages/auth";

const icon = {
	className: "w-5 h-5 text-inherit",
};

export const routes = [
	{
		layout: "dashboard",
		pages: [
			{
				icon: <HomeIcon {...icon} />,
				name: "dashboard",
				path: "/home",
				element: <Home />,
			},
			{
				icon: <CurrencyDollarIcon {...icon} />,
				name: "loans",
				path: "/loans",
				element: <Loans />,
			},
			{
				icon: <CurrencyDollarIcon {...icon} />,
				name: "loan details",
				path: "/loan-details",
				element: <LoanDetails />,
			},
			{
				icon: <ReceiptRefundIcon {...icon} />,
				name: "payment batches",
				path: "/payment-batches",
				element: <ReceiptBatches />,
			},
			{
				icon: <ReceiptRefundIcon {...icon} />,
				name: "payments",
				path: "/payments",
				element: <Receipts />,
			},
			{
				icon: <ReceiptRefundIcon {...icon} />,
				name: "add payments",
				path: "/add-payments",
				element: <AddReceipt />,
			},
			{
				icon: <CurrencyDollarIcon {...icon} />,
				name: "add loan",
				path: "/add-loan",
				element: <AddLoan />,
			},
			{
				icon: <UserGroupIcon {...icon} />,
				name: "clients",
				path: "/clients",
				element: <Clients />,
			},
			{
				icon: <UserGroupIcon {...icon} />,
				name: "client details",
				path: "/client-details",
				element: <ClientDetails />,
			},
			{
				icon: <BuildingOfficeIcon {...icon} />,
				name: "organizations",
				path: "/organizations",
				element: <Organizations />,
			},
			{
				icon: <BuildingLibraryIcon {...icon} />,
				name: "client banks",
				path: "/banks",
				element: <Banks />,
			},
			{
				icon: <ClipboardDocumentListIcon {...icon} />,
				name: "reports",
				path: "/reports",
				element: <Reports />,
			},
			{
				icon: <UserCircleIcon {...icon} />,
				name: "add client",
				path: "/add-client",
				element: <AddClient />,
			},
			{
				icon: <BuildingOfficeIcon {...icon} />,
				name: "add organization",
				path: "/add-organization",
				element: <AddOrganization />,
			},
			{
				icon: <BuildingLibraryIcon {...icon} />,
				name: "add bank",
				path: "/add-bank",
				element: <AddBank />,
			},
			{
				icon: <UserCircleIcon {...icon} />,
				name: "profile",
				path: "/profile",
				element: <Profile />,
			},
			{
				icon: <TableCellsIcon {...icon} />,
				name: "tables",
				path: "/tables",
				element: <Tables />,
			},
			{
				icon: <BellIcon {...icon} />,
				name: "notifactions",
				path: "/notifactions",
				element: <Notifications />,
			},
		],
	},
	{
		title: "auth pages",
		layout: "auth",
		pages: [
			{
				icon: <ArrowRightOnRectangleIcon {...icon} />,
				name: "sign in",
				path: "/sign-in",
				element: <SignIn />,
			},
			{
				icon: <UserPlusIcon {...icon} />,
				name: "sign up",
				path: "/sign-up",
				element: <SignUp />,
			},
		],
	},
];

export default routes;
