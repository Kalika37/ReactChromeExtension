
function ismobile() {
    if (navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)) {
        a = true;
    } else {
        a = false;
    }
    return a;
}
const user = {
    username: 'demo-user',
    news: {
        description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint quas perferendis ad ratione, inventore doloribus fugit aliquid dolores tempore neque, asperiores nihil! Consequatur, repellendus? Adipisci laborum similique consequatur? Et, consequatur.",
        date: '3rd november 2024',
        title: "nepali news",
        source: {
            title: "kantipur",
            url: "https://kantipur.com"
        }
    },
    status: true
};
chrome.contextMenus.removeAll()
chrome.contextMenus.create(
    { id: Date.now().toString(), title: `Chek if this is a fake News`, contexts: ["selection"] });
chrome.contextMenus.onClicked.addListener((e) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "Context_Menu_clicked", text: e.selectionText });
    });

}
)
var generatePassword = (
    length = 64,
    characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
) =>
    Array.from(crypto.getRandomValues(new Uint32Array(length)))
        .map((x) => characters[x % characters.length])
        .join('')
class HTTP {
    static POST(url, datas) {
        return new Promise((response, reject) => {
            const data = new FormData()
            datas['chromeruntimeid'] = chrome.runtime.id
            datas['csrfmiddlewaretoken'] = generatePassword()
            for (const key in datas) {
                data.append(key, datas[key])
            }


            fetch(url,
                {
                    method: "POST",
                    body: data
                })
                .then(function (res) { console.log(res); response(res.json()); })

        })
    }
    static GET(url) {
        return new Promise((response, reject) => {
            fetch(url,
                {
                    method: "GET",
                })
                .then(function (res) { return response(res.json()); })
        })
    }

}

class SharesTo {
    static OurLink = 'http://localhost:8000/searchreasult?q='
    static whatsapp = `https://wa.me/?url=`
    static facebook = `https://www.facebook.com/sharer/sharer.php?u=`
    static twitter = `https://twitter.com/intent/tweet?url=`
}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === 'CheckNewsForthis') {
        HTTP.POST('http://localhost:8000/checkifFake', {
            content: message.news
        }).then(res => {
            sendResponse(res)
        })
        return true
    }
    if (message.command === "ShareResult") {
        if (message.shareto === 'more') {

        } else {
            const url = `${SharesTo[message.shareto]}` + `${SharesTo.OurLink}${message.searchfor}`
            setTimeout(() => {
                chrome.tabs.create({
                    url
                })
            }, 5000);
        }
    }
    console.log(message)
    if(message.command==="ReportIssue"){
        HTTP.POST('http://localhost:8000/report_news', {
            content: message.message
        })
    }
    if(message.command==="Feedback"){
        HTTP.POST('http://localhost:8000/send_feedback', {
            content: message.message
        })
    }
});
