export default class HTTP {
    static POST(url: string, datas: any) {
        return new Promise((response, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            xhr.open("POST", url, true);
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
            // xhr.setRequestHeader("Content-Type", "application/json");
            const data = new FormData()
            for (const key in datas) {
                data.append(key, datas[key])
            }
            xhr.onload = () => response(xhr.response);

            xhr.send(data);
        })
    }
    static GET(url: string) {
        return new Promise((response, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open("Get", url, true);
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
            xhr.onload = () => response(xhr.response);
            xhr.send();
        })
    }

}