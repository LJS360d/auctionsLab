const API_URL = 'http://localhost:8080';

export async function getAllItems() {
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
    http.open('GET', API_URL + endpoint);
    http.send();
  });
}

export async function getItemByName(body) {
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

    http.open('GET', API_URL + endpoint);
    http.send(body ?? {});
  });
}
