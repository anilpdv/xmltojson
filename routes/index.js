const { convertXmlToJson } = require("../xml2json");

const router = require("express").Router();

// @route : '/xmltojson/:url'
// @desc  : returns json
// @access: public
router.get("/xmltojson", (req, res, next) => {
  let url = req.query.url;
  convertXmlToJson(url, res, next);
});

module.exports = router;
