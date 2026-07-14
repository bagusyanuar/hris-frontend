export interface NavigationItem {
	label: string;
	icon?: string;
	href: string;
	isSubItem?: boolean;
}

export interface NavigationExpandable {
	label: string;
	icon: string;
	hashPattern?: string; // custom pattern for matching current URL if needed
	subItems: NavigationItem[];
}

export interface NavigationGroup {
	title: string;
	items: (NavigationItem | NavigationExpandable)[];
}

export const navigationConfig: NavigationGroup[] = [
	{
		title: 'Employees',
		items: [
			{ label: 'Dashboard', icon: 'lucide:grid', href: '/' },
			{ label: 'Staff Directory', icon: 'lucide:users', href: '/employees' },
			{ label: 'Time & Attendance', icon: 'lucide:clock', href: '#time' }
		]
	},
	{
		title: 'Finance',
		items: [
			{
				label: 'Payroll',
				icon: 'lucide:banknote',
				subItems: [
					{ label: 'Run Payroll', href: '#run-payroll' },
					{ label: 'Payslips', href: '#payslips' }
				]
			},
			{ label: 'Expenses', icon: 'lucide:wallet', href: '#expenses' }
		]
	}
];
