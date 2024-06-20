import { createConnection } from 'net';
import io from '../services/io';
import { Constants } from '../utils/constants';

const PORT = Constants.PORT;
const HOST = Constants.HOST;

const client = createConnection({ port: PORT, host: HOST }, () => {
    io.print('Connected to server');
    promptLogin();
});

client.on('data', (data) => {
    const message = data.toString().trim();
    io.print(`\nServer: ${message}\n`);
    if (message === 'LOGIN_SUCCESS') {
        showMenu();
    } else if (message === 'LOGIN_FAIL') {
        io.print('Invalid credentials. Please try again.');
        promptLogin();
    } else if (message === 'LOGOUT_SUCCESS') {
        io.print('Successfully logged out.');
        promptLogin();
    } else if (message === 'LOGOUT_FAIL') {
        io.print('Logout failed. You are not logged in.');
        showMenu();
    } else {
        showMenu();
    }
});

client.on('end', () => {
    io.print('Disconnected from server');
});

client.on('error', (err) => {
    io.print(`Client error: ${err.message}`);
});

const promptLogin = () => {
    io.print('\n\nLogin');
    const employeeCode = io.getInput('Enter your employee code: ');
    const name = io.getInput('Enter your name: ');
    client.write(`LOGIN ${employeeCode} ${name}`);
};

const showMenu = () => {
    const options = ['View Notifications', 'View Menu', 'Add Review', 'Logout'];
    const choice = io.showMenu(options);

    switch (choice) {
        case 1:
            // TODO: Show Notifications
            client.write('1');
            break;
        case 2:
            // TODO: Show Menu
            client.write('2');
            break;
        case 3:
            // TODO: Show Menu
            // TODO: Add Review
            client.write('3');
            break;
        case 4:
            client.write('LOGOUT');
            break;
        default:
            io.print('Invalid option. Please try again.');
    }
};
