import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import {
	Typography,
	Card,
	CardHeader,
	CardBody,
	IconButton,
	Menu,
	MenuHandler,
	MenuList,
	MenuItem
} from "@material-tailwind/react";
import {
	UserIcon,
	UsersIcon,
	BuildingOfficeIcon,
} from "@heroicons/react/24/solid";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";

// import { statisticsCardsData } from "@/data";

export function Home() {

	const API_URL = import.meta.env.VITE_API_URL;

	const [loans, setLoans] = useState([]);
	const [page, setPage] = useState(1);
	const [statisticsData, setStatisticsData] = useState([
		{
			color: "blue",
			icon: UsersIcon,
			title: "Clients",
			value: 0,
		},
		{
			color: "green",
			icon: UserIcon,
			title: "Active Loans",
			value: 0,
		},
		{
			color: "yellow",
			icon: BuildingOfficeIcon,
			title: "Organisations",
			value: 0,
		}
	]);

	useEffect(() => {
		// Make an HTTP request to fetch data from the API
		axios.get(`${API_URL}/loans?page=${page}`)
			.then((response) => {
				setLoans(response.data.data);
			})
			.catch((error) => {
				console.error('Error fetching loan data:', error);
			});
	}, [page]);

	useEffect(() => {
		// Function to fetch statistics data from the API
		const fetchStatisticsData = async () => {
			try {
				// Make an HTTP request to fetch statistics data from your API
				const response = await axios.get(`${API_URL}/counters`); // Replace with your actual API endpoint

				// Update the statisticsData array with the retrieved values
				setStatisticsData(prevData => [
					{
						...prevData[0],
						value: response.data[0].client_count || 0,
					},
					{
						...prevData[1],
						value: response.data[0].loan_count || 0,
					},
					{
						...prevData[2],
						value: response.data[0].organization_count || 0,
					}
				]);

			} catch (error) {
				console.error('Error fetching statistics data:', error);
			}
		};

		// Call fetchStatisticsData once the component has mounted
		fetchStatisticsData();
	}, []);

	return (
		<div className="mt-12">
			<div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
				{statisticsData.map(({ icon, title, ...rest }) => (
					<StatisticsCard
						key={title}
						{...rest}
						title={title}
						icon={React.createElement(icon, {
							className: "w-6 h-6 text-white",
						})}
					// footer={
					// 	<Typography className="font-normal text-blue-gray-600">
					// 		<strong className={footer.color}>{footer.value}</strong>
					// 		&nbsp;{footer.label}
					// 	</Typography>
					// }
					/>
				))}
			</div>
			<div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-1">
				<Card className="overflow-hidden xl:col-span-2">
					<CardHeader
						floated={false}
						shadow={false}
						color="transparent"
						className="m-0 flex items-center justify-between p-6"
					>
						<div>
							<Typography variant="h6" color="blue-gray" className="mb-1">
								Loans
							</Typography>
						</div>
						<Menu placement="left-start">
							<MenuHandler>
								<IconButton size="sm" variant="text" color="blue-gray">
									<EllipsisVerticalIcon
										strokeWidth={3}
										fill="currenColor"
										className="h-6 w-6"
									/>
								</IconButton>
							</MenuHandler>
							<MenuList>
								<MenuItem>Action</MenuItem>
								<MenuItem>Another Action</MenuItem>
								<MenuItem>Something else here</MenuItem>
							</MenuList>
						</Menu>
					</CardHeader>
					<CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
						<table className="w-full min-w-[640px] table-auto">
							<thead>
								<tr>
									{["Client Name", "Email", "Phone", "Organization", "Status", "Amount", "Contract Date", " "].map((el) => (
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
					</CardBody>
				</Card>
				{/* <Card>
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-6"
          >
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Orders Overview
            </Typography>
            <Typography
              variant="small"
              className="flex items-center gap-1 font-normal text-blue-gray-600"
            >
              <ArrowUpIcon
                strokeWidth={3}
                className="h-3.5 w-3.5 text-green-500"
              />
              <strong>24%</strong> this month
            </Typography>
          </CardHeader>
          <CardBody className="pt-0">
            {ordersOverviewData.map(
              ({ icon, color, title, description }, key) => (
                <div key={title} className="flex items-start gap-4 py-3">
                  <div
                    className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${
                      key === ordersOverviewData.length - 1
                        ? "after:h-0"
                        : "after:h-4/6"
                    }`}
                  >
                    {React.createElement(icon, {
                      className: `!w-5 !h-5 ${color}`,
                    })}
                  </div>
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-medium"
                    >
                      {title}
                    </Typography>
                    <Typography
                      as="span"
                      variant="small"
                      className="text-xs font-medium text-blue-gray-500"
                    >
                      {description}
                    </Typography>
                  </div>
                </div>
              )
            )}
          </CardBody>
        </Card> */}
			</div>
		</div>
	);
}

export default Home;
