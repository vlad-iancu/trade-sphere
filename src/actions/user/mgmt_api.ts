"use server"
import axios from "axios";

export async function getMgmtApiToken(): Promise<string> {
    // console.log(`url is ${process.env.AUTH_AUTH0_ISSUER + '/oauth/token'}`)
    // console.log(`client id is ${process.env.AUTH_AUTH0_API_ID}`)
    // console.log(`client secret is ${process.env.AUTH_AUTH0_API_SECRET}`)
    // console.log(`audience is ${process.env.AUTH_AUTH0_ISSUER + "/api/v2/"}`)
    var options = {
        method: 'POST',
        //url: 'https://dev-of2vya24vlnwgwoh.us.auth0.com/oauth/token',
        url: process.env.AUTH_AUTH0_ISSUER + '/oauth/token',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: process.env.AUTH_AUTH0_API_ID ?? (Error('Client id not found'), ""),
            client_secret: process.env.AUTH_AUTH0_API_SECRET ?? (Error('Client secret not found'), ""),
            audience: process.env.AUTH_AUTH0_ISSUER + "/api/v2/"
        })
    };

    return await axios.request(options).then(function (response): string {
        //console.log(`data is ${response.data}`)
        return response.data["access_token"] ?? "";
    }).catch(function (error): string {
        //console.log(`error is ${error.message}`)
        return (Error('Error getting token'), "");
    });
}

export async function updateUserMetadata(userMetadata: any, userId: string): Promise<boolean> {
    const token = await getMgmtApiToken();
    //return false
    var options = {
        method: 'PATCH',
        url: process.env.AUTH_AUTH0_ISSUER + '/api/v2/users/' + userId,
        headers: {
            'content-type': 'application/json',
            accept: 'application/json',
            authorization: 'Bearer ' + token
        },
        data: {user_metadata: userMetadata}
    };

    return await axios.request(options).then(function (response): boolean {
        return response.status === 200;
    }).catch(function (error): any {
        return false
    });
}

export async function getUserMetadata(userId: string): Promise<any> {
    const token = await getMgmtApiToken();
    var options = {
        method: 'GET',
        url: process.env.AUTH_AUTH0_ISSUER + '/api/v2/users/' + userId,
        headers: {
            accept: 'application/json',
            authorization: 'Bearer ' + token
        }
    };

    return await axios.request(options).then(function (response): any {
        return response.data["user_metadata"];
    }).catch(function (error): any {
        return (Error('Error getting user metadata'), {});
    });
}