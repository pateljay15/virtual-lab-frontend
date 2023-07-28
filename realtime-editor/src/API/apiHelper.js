export const compileC = (code, input) => {
    return fetch(`http://localhost:5000/compile/c`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({code, input})
    }).then(response => {
        return response.json()
    }).catch(err => console.log(err))
}