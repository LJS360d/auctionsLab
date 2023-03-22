const API_URL = 'localhost:8080';
export function getAllItems(body){
    const http = new XMLHttpRequest();
    const endpoint = '/getbyname'
    http.open('GET',API_URL+endpoint)
    http.send(body ? body : {});
    http.onreadystatechange(()=>{
        return http.responseText
    })
}