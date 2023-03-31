export const API_URL = 'http://localhost:9090';
export const MULTICAST_URL = 'http://localhost:9097';
export const PROXY_URL = 'ws://localhost:9098';
export async function getAllItems() {
  return new Promise((resolve, reject) => {
    const http = new XMLHttpRequest();
    const endpoint = '';

    http.onreadystatechange = function () {
      if (http.readyState === 4) {
        if (http.status === 200) {
          resolve(http.responseText);
        } else {
          reject(new Error(`Failed to fetch items: ${http.statusText}`));
        }
      }
    };
    http.onerror = function () {
      reject(new Error(`Failed to fetch items: ${http.statusText}`));
    };
    http.open('GET', API_URL + endpoint, true);
    http.send();
  });
}

export async function postGetByName(itemName) {
  return new Promise((resolve, reject) => {
    const http = new XMLHttpRequest();
    const endpoint = '/getbyname';

    http.onreadystatechange = function () {
      if (http.readyState === 4) {
        if (http.status === 200) {
          resolve(http.responseText);
        } else {
          reject(new Error(`Failed to fetch items: ${http.statusText}`));
        }
      }
    };

    http.onerror = function () {
      reject(new Error(`Failed to fetch items: ${http.statusText}`));
    };

    http.open('POST', API_URL + endpoint, true);
    http.send(itemName ?? '');
  });
}

export async function get(endpoint) {
  return new Promise((resolve, reject) => {
    const http = new XMLHttpRequest();
    let API_Endpoint = String(endpoint ?? '');
    if (API_Endpoint[0] !== '/')
      API_Endpoint.padStart(API_Endpoint.length + 1, '/')

    http.onreadystatechange = function () {
      if (http.readyState === 4) {
        if (http.status === 200) {
          resolve(http.responseText);
        } else {
          reject(new Error(`Failed to fetch items: ${http.statusText}`));
        }
      }
    };
    http.onerror = function () {
      reject(new Error(`Failed to fetch items: ${http.statusText}`));
    };
    http.open('GET', API_URL + API_Endpoint, true);
    http.send();
  });
}
/**
 * 
 * @param {String} body 
 * @param {String} endpoint 
 * @returns 
 */
export async function post(body, endpoint) {
  //return await fetch(API_URL+endpoint,{method:'POST',body:body}).then(res => res.json())
  return new Promise((resolve, reject) => {
    const http = new XMLHttpRequest();
    let API_Endpoint = String(endpoint ?? '');
    if (API_Endpoint[0] !== '/')
      API_Endpoint.padStart(API_Endpoint.length + 1, '/')
    http.onreadystatechange = function () {
      if (http.readyState === 4) {
        if (http.status === 200) {
          resolve(http.responseText);
        } else {
          reject(new Error(`Failed to fetch items: ${http.statusText}`));
        }
      }
    };

    http.onerror = function () {
      reject(new Error(`Failed to fetch items: ${http.statusText}`));
    };

    http.open('POST', API_URL + API_Endpoint, true);
    http.send(body ?? '');
  });
}

export async function sendUDP(msg, ...args) {
  const proxyConnection = io(PROXY_URL)
  proxyConnection.send(msg, ...args)
  return new Promise((resolve, reject) => {
    proxyConnection.on(msg, (statusmsg) => {
      statusmsg ?
        resolve(statusmsg) :
        reject(new Error(`Unable to Execute Update`))
    })
  })
}