class LinkService {

  static async test(links) {
    const aRegex = /<a[^>]*href=['"]([^'"]*)['"][^>]*>([\s\S]*?)<\/a>/g;
    const titleRegex = /<title[^>]*>([\s\S]*?)<\/title>/;
    const robotsRegex = /<meta[^>]*?name=["']robots["'][^>]*?>/i;
    const faviconRegex = /<link[^>]*(?:rel\s*=\s*['"](?:shortcut icon|icon)['"][^>]*)\s*href\s*=\s*['"]([^'"]*)['"][^>]*>/i;
    const hrefRegex = /(?<=href=")[^"]+/g;
    const aTags = [];
    const htmlOfLinks = [];
    const htmlOfExternals = [];
    const mainStatuses = [];
    const externalStatuses = [];
    const aExternals = [];
    const dataSet = [];
    const info = [];
    const hrefValues = [];
    const keywords = [];
    const title = [];
    const robots = [];
    const robotsOfExternals = [];
    const favicons = [];
    const externalInfo = [];

    try {
      const dataMain = await Promise.all(links.map((elem) => fetch(elem)));

      for (let elem of dataMain) {
        //Receive text of HTML
        let mainText = await elem.text();
        htmlOfLinks.push(mainText)
        //Receive statuses of Links
        mainStatuses.push(elem.status);
      }
    } catch (error) {
      return "Please input the correct link"
    }

    for (let i = 0; i < links.length; i++) {
      try {
        const domains = links.map((el) => new URL(el).hostname.replace('www.',''));
        externalInfo.push([]);
        console.log(domains,"== domains");
        aTags.push(htmlOfLinks[i].match(aRegex));
        aExternals.push([...new Set(aTags[i])].filter((el) => !el.includes('@') && el.includes('http://') && !el.includes('.js') && !el.includes('.css') && !el.includes('.html') && !el.includes(domains[i]) || !el.includes('@') && el.includes('https://') && !el.includes('.js') && !el.includes('.css') && !el.includes('.html') && !el.includes(domains[i])));
        const sorted = aExternals[i].map((el) => el.split(' ').sort().join(' '));
        dataSet.push([...new Set(sorted)]);
        title.push(htmlOfLinks[i].match(titleRegex));
        robots.push(String(htmlOfLinks[i].match(robotsRegex)));
        favicons.push(htmlOfLinks[i].match(faviconRegex));

        //Getting External links
        hrefValues.push(dataSet[i].map(aTag => {
          const matches = aTag.match(hrefRegex);
          return matches ? matches[0] : null;
        }));

        //Getting Keywords of Main links
        keywords.push(aExternals[i].map(string => {
          const match = string.match(/[^<>]+/g);
          if (match) {
            return match.length > 2 ? match[Math.floor(match.length/2)] : ''
          }
        }));

        //Creating object for All Information of Main link
        info.push(
          {
            link: links[i],
            externals: [dataSet[i].length],
            title: title[i] === null ? title[i] : title[i][1],
            robot_tag: robots[i] === undefined || !robots[i].includes('noindex') || robots[i] === "null" ? 'indexable' : 'noindexable',
            favicon: favicons[i][1].includes('https://') || favicons[i][1].includes('http://') ? favicons[i][1] : links[i] + '/' + favicons[i][1],
            status: mainStatuses[i],
            externalInfo: externalInfo[i]
          }
        )

        for (let y = 0; y < hrefValues[i].length; y++) {
          const dataExternal = await Promise.all(hrefValues[i].map((elem) => fetch(elem,{redirect: "manual"})));
          for (let elem of dataExternal) {
            //Receiving Externals text from HTML
            let externalsText = await elem.text();
            htmlOfExternals.push(externalsText);
            //Getting statuses of externals links
            externalStatuses.push(elem.status);
          }
          robotsOfExternals.push(String(htmlOfExternals[y].match(robotsRegex)));
        }

        //Pushing Information about external links
        for (let x = 0; x < dataSet[i].length; x++) {
          externalInfo[i].push({
            url: hrefValues[i][x],
            rel: dataSet[i][x].includes('nofollow') ? "nofollow" : "dofollow",
            keyword: aExternals[i][x].includes(keywords[i][x]) && keywords[i][x] !== '' ? keywords[i][x] : "null",
            robot_tag: robotsOfExternals[x] === undefined || robotsOfExternals[x] === "null" || !robotsOfExternals[x].includes('noindex') ? 'indexable' : 'noindexable',
            status: externalStatuses[i]
          })
        }
      } catch (error) {
        console.log(error);
        if (hrefValues[i] !== undefined) {
          for (let x = 0; x < dataSet[i].length; x++) {
            externalInfo[i].push({
              url: hrefValues[i][x],
              rel: dataSet[i][x].includes('nofollow') ? "nofollow" : "dofollow",
              keyword: aExternals[i][x].includes(keywords[i][x]) && keywords[i][x] !== '' ? keywords[i][x] : "null",
              robot_tag: robotsOfExternals[x] === undefined || robotsOfExternals[x] === "null" || !robotsOfExternals[x].includes('noindex') ? 'indexable' : 'noindexable',
              status: String(error).includes(hrefValues[i][x]) ? 'failed' : 200
            })
          }
        } else {
          return "Please input the correct link"
        }
      }
    }
    return info;
  }
}

module.exports = LinkService;