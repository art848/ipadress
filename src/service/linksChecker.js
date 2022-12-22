class CheckerLinks {

    static linksTest(url, setings) {
        global.links = [];
        return CheckerLinks.test(url, setings);
    }
    static async test(url, setings) {
        //Fetch for redirected urls
        await fetch(url, setings).then(async (res) => {
            try {
                links.push({
                    url,
                    status: res.status
                });
                
                if (res.headers.get('Location') !== url
                    && (res.status === 301
                        || res.status === 302)) {

                    await CheckerLinks.test(res.headers.get('Location'), setings);

                } else {

                    return links;

                }
            } catch (err) {
                console.log(err);
            }
        });
        return links
    }

}

module.exports = CheckerLinks