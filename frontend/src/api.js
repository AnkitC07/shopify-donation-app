import api from "../appConfig";


export const LoginAction = async (email, password) => {
    const apiUrl = `${api}/api/login`;

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    };

    try {
        const response = await fetch(apiUrl, options);

        if (!response.ok) {
            throw new Error(`Login failed - ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data; // Return the response data after successful login
    } catch (error) {
        throw new Error(`Login Error: ${error.message}`);
    }
};