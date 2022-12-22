const LinkService = require('../service/link.service');
const CheckerLinks = require('../service/linksChecker');

let data;

class UrlsController {
  static async test(req, res, next) {
    try {
      const val = req.body;
      const url = Object.values(val);
      console.log(url);
      const link = await LinkService.test(url);
      res.send(link);
    } catch (error) {
      next(error);
    }
  }

  static async checker(req, res, next) {
    try {
      const urls = req.body;
      console.log(urls);
      await Promise.all(urls.map(async (url) => {

        const currUrl = url;
        const setingss = { redirect: 'manual' };

        data = await CheckerLinks.linksTest(currUrl, setingss);

      }))
      res.send(data)

    } catch (error) {
      next(error)
    }
  }
}

module.exports = UrlsController;