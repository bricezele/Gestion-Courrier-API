/**
 * Project yoolearn-backend
 * File user.interface
 * Path src/api/oauth/interfaces
 * Created by BRICE ZELE
 * Date: 09/08/2021
 */
export interface IUsers {
    readonly id: number;
    readonly name: string;
    readonly username: string;
    readonly email: string;
    readonly password: string;
}
