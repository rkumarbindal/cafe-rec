import databaseService from "../services/database";

class AuthDao {
    async selectUser<T>(employeeCode: string) {
        const query = `select * from t_user where ID = '${employeeCode}'`;
        const result = await databaseService.execute(query);
        if (result) {
            return (result as T[])[0];
        }
        return null;
    }
}

export default AuthDao;