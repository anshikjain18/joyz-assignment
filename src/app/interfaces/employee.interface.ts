export interface Employee {
	email: string;
	fullName: string;
	role: EmployeeRoles;
	reportsTo: string;
	row: number;
}

export interface EmployeeDictionary {
	[email: string]: Employee;
}

export interface CycleNode {
	email: string;
	row: number;
}

export enum EmployeeRoles {
	ROOT = 'Root',
	ADMIN = 'Admin',
	MANAGER = 'Manager',
	CALLER = 'Caller',
}

export enum UploadBoxMessage {
	DEFAULT = 'Drag & Drop your file here or Click to upload',
	DRAGOVER = 'Drop your file to upload',
}
