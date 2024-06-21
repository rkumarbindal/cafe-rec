export interface User {
    employeeCode: string;
    name: string;
    roleId: string;
}

export enum Role {
    Admin = 'rl1',
    Employee = 'rl2',
    Chef = 'rl3'
}