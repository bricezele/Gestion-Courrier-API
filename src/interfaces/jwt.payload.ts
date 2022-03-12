/**
 * Project yoolearn-backend
 * File jwt.payload
 * Path src/api/oauth/interfaces
 * Created by BRICE ZELE
 * Date: 09/08/2021
 */

export interface JwtPayload {
    readonly email: string;
    readonly password?: string;
}
