import axios from "axios";

export const checkUserAlreadyReferred = async (walletAddress: string) => {
    const id = window.btoa(walletAddress);
    return fetch(`https://backend-api-pi.vercel.app/api/mlm/checkUser/${id}`)
        .then((res: any) => res.json())
        .then((data) => {
            return data;
        })
        .catch(error => {
            console.error("Failed to get user status: " + error)
        });
}

export const getUserReferralInfo = async (walletAddress: string) => {
    const id = window.btoa(walletAddress);
    return fetch(`https://backend-api-pi.vercel.app/api/mlm/getUser/${id}`)
        .then((res: any) => res.json())
        .then((data) => {
            return data;
        })
        .catch(error => {
            console.error("Failed to get user status: " + error)
        });
}

export const registerUserWithParent = async (account: string, id: string, signedMessage: string, originMessage: string) => {
    return axios.post("https://backend-api-pi.vercel.app/api/mlm/registerUser/", {
        me: account,
        parent: id,
        signedMessage,
        originMessage,
    }).catch((err) => {
        alert('Referral Registration Failed! Reload browser to try again!');
    });
}

export const registerSoloUser = async (account: string, signedMessage: string, originMessage: string) => {
    return axios.post("https://backend-api-pi.vercel.app/api/mlm/registerSoloUser/", {
        me: account,
        signedMessage,
        originMessage,
    }).catch((err) => {
        alert('Referral Registration Failed! Reload browser to try again!');
    });
}