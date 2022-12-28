const LinkService = require('../service/link.service')
let urls;

class CheckerLinks {
    static async linksTest(url, setings) {
        global.links = [];
        return await CheckerLinks.test(url, setings);
    }
    static async test(url, setings) {
        try {
            await fetch(url, setings).then(async (res) => {

            

                if (res.headers.get('Location') !== url
                    && (res.status === 301
                        || res.status === 302)) {
                        
                            urls = []
                            urls.push(res.url)
            
                            const x = await LinkService.test(urls);
                            console.log(x,"xx");
            
                        links.push({
                            url:`${url} redirected`,
                            status: res.status,

                        }); 
        
                            
            
                    await CheckerLinks.test(res.headers.get('Location'), setings);
                 
                   
                        console.log(res.url,885885);

                } else {
                    urls = []
                    urls.push(res.url)

                    const x = await LinkService.test(urls);

                links.push({
                    url,
                    status: res.status,
                    info : x
                });
                    return links
                }
            })
        } catch {
            return ("Ohh NO! This is invalid url");
        }
        return links
    }
}

module.exports = CheckerLinks