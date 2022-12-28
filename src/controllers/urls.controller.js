const { crowler } = require('../service/crowjob');

class UrlsController {
  

  static async point(req, res, next) {
    try {
      console.log(123);
      const response = await crowler();  
      console.log(response);
      res.send(response)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = UrlsController;