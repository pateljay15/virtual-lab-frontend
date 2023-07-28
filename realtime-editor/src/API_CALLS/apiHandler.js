const API = "http://localhost:5000/api";

export const signup = user => {
    return fetch(`${API}/signup`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            return response.json()
        })
        .catch(err => console.log(err));
};

export const signin = user => {
    return fetch(`${API}/signin`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            return response.json()
        })
        .catch(err => console.log(err))
}

export const authenticate = (data, next) => {
    if (typeof Window !== "undefined") {
        localStorage.setItem("jwt", JSON.stringify({"token": data.token, "user": data.user}))
        localStorage.setItem("profile", JSON.stringify({"profile": data.profile}))

        next()
    }
}

export const isAuthenticated = () => {
    if (typeof Window == "undefined") {
        return false
    }

    if (localStorage.getItem("jwt")) {
        return JSON.parse(localStorage.getItem("jwt"))
    } else {
        return false
    }
}

export const userProfile = () => {
    if (typeof Window == "undefined") {
        return false
    }

    if (localStorage.getItem("profile")) {
        return JSON.parse(localStorage.getItem("profile"))
    } else {
        return false
    }
}

export const updateStudent = (userId, token, data) => {
    console.log(data, userId, token)
    return fetch(`http://localhost:5000/api/user/update/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            return response.json()
        })
        .catch(err => console.log(err));
};

export const updateLabStatus = (userId, token, data) => {
    console.log(data, userId, token)
    return fetch(`http://localhost:5000/leaveLab/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            return response.json()
        })
        .catch(err => console.log(err));
};

export const createLab = (userId, token, data) => {
    console.log(data)
    return fetch(`http://localhost:5000/createlab/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            return response.json()
        })
        .catch(err => console.log(err));
};

export const joinLab = (userId, token, data) => {
    console.log(data)
    return fetch(`http://localhost:5000/join/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            return response.json()
        })
        .catch(err => console.log(err));
};


export const compile = (code, input, lang) => {
    return fetch(`http://localhost:5000/compile`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({code, input, lang})
    }).then(response => {
        return response.json()
    }).catch(err => console.log(err))
}

