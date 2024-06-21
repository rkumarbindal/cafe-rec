import { createServer, Socket } from 'net';
import { Constants } from '../../utils/constants';
import AuthService from '../../services/auth-service';
import databaseService from '../../services/database';

databaseService.init().then(() => {
    console.log('Connect to database');
}).catch((err: unknown) => {
    console.log(err);
})

const PORT = Constants.PORT;
const HOST = Constants.HOST;

const authenticatedClients = new Map<Socket, boolean>();

const handleLogin = async (socket: Socket, credentials: string[]) => {
    const authService = new AuthService(socket);
    const isLoginSuccess = await authService.login(socket, credentials);
    if (isLoginSuccess) {
        authenticatedClients.set(socket, true);
    }
}

const handleLogout = (socket: Socket) => {
    const authService = new AuthService(socket);
    authService.logout(socket, authenticatedClients);
}

const handleData = (socket: Socket, data: Buffer) => {
    const message = data.toString().trim();
    const [command, ...credentials] = message.split(' ');
    switch (command) {
        case 'LOGIN':
            void handleLogin(socket, credentials);
            break;
        case 'LOGOUT':
            handleLogout(socket);
            break;
        default:
            handleAuthenticatedCommands(socket, message);
    }
};

const handleAuthenticatedCommands = (socket: Socket, message: string) => {
    socket.write(`Received: ${message}\n`);
    if (authenticatedClients.get(socket)) {
        // TODO: Manage actions based on user input
        socket.write(`Received: ${message}\n`);
    } else {
        socket.write('Please login first\n');
    }
};

const server = createServer((socket) => {
    console.log('Client connected');
    socket.on('data', (data) => { handleData(socket, data); });
    socket.on('end', () => { handleClientDisconnect(socket); });
    socket.on('error', (err) => { handleError(socket, err); });
});

const handleClientDisconnect = (socket: Socket) => {
    console.log('Client disconnected');
    authenticatedClients.delete(socket);
};

const handleError = (socket: Socket, err: Error) => {
    console.error(`Socket error: ${err.message}`);
    authenticatedClients.delete(socket);
};

server.listen(PORT, HOST, () => {
    console.log(`Server listening on ${HOST}:${PORT.toString()}`);
});

server.on('error', (err) => {
    console.error(`Server error: ${err.message}`);
});
