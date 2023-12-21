import {
	UserIcon,
	UsersIcon,
	BuildingOfficeIcon,
} from "@heroicons/react/24/solid";

export let statisticsCardsData = [
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
		title: "Organisation",
		value: 0,
	}
];

export default statisticsCardsData;
