import { Socket } from 'net';
import AuthDao from '../dao/auth.dao';
import { UserModel } from '../model/user.model';
import { User } from '../types/user';
class AuthService {
    socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    async login(socket: Socket, args: string[]): Promise<boolean> {
        const [employeeCode, name] = args;
        try {
            const user = await this.getUser(employeeCode);
            if (employeeCode === user?.employeeCode && name === user.name) {
                socket.write(user.roleId);
                return true;
            } else {
                socket.write('LOGIN_FAIL\n');
                return false;
            }
        }
        catch (error) {
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

    private async getUser(employeeCode: string): Promise<User | null> {
        const authDao = new AuthDao();
        const user = await authDao.selectUser<UserModel>(employeeCode);
        if (!user) {
            console.log('Employee Id or name is incorrect.');
            return null;
        }
        return {
            employeeCode: user.ID,
            name: user.NAME,
            roleId: user.ROLE_ID
        };
    }
}

export default AuthService;