import { Socket } from 'net';
class AuthService {
    socket: Socket;
    USERNAME = 'user';
    PASSWORD = 'pass'

    constructor(socket: Socket) {
        this.socket = socket;
    }

    login(socket: Socket, args: string[]): boolean {
        const [username, password] = args;
        if (username === this.USERNAME && password === this.PASSWORD) {
            socket.write('LOGIN_SUCCESS\n');
            return true;
        } else {
            socket.write('LOGIN_FAIL\n');
            return false;
        }
    };

    logout(socket: Socket, authenticatedClients: Map<Socket, boolean>) {
        if (authenticatedClients.has(socket)) {
            authenticatedClients.delete(socket);
            socket.write('LOGOUT_SUCCESS\n');
        } else {
            socket.write('LOGOUT_FAIL\n');
        }
    };

    // TODO: Validate user credentials from database.
}

export default AuthService;