export const useGetToken = () => {
    const data = getCookie("user");
    const obj = {
        token: data ? data : null,
    };
    if (!data) {
        return null;
    }
    return obj;
};

function getCookie(key) {
    var b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
    return b ? b.pop() : "";
}

export function setcookies(name, token) {
    let date = (new Date(Date.now() + 86400 * 1000))
    document.cookie = name + "=" + token + "; " + date;
}


