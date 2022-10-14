const axios = require("axios");
const convert = require("xml-js");

const convertXmlToJson = (url, res, next) => {
  axios
    .get(`${url}`)
    .then(function (response) {
      const data = JSON.parse(
        convert.xml2json(response.data, {
          compact: true,
          attributesKey: "attributes",
          cdataKey: "cdata",
          paces: 2,
        })
      );

      let transformedData = { audioTracks: { title: "", chapters: [] } };

      if (data && data.rss && data.rss.channel) {
        transformedData.audioTracks.title = data.rss.channel.title.cdata;

        if (data.rss.channel && data.rss.channel.item) {
          let items = data.rss.channel.item;

          items.forEach((item) => {
            let chapter = {
              title: "",
              url: "",
              type: "",
              duration: "",
              episode: "",
            };
            chapter.title = item.title && item.title.cdata;
            chapter.episode =
              item["itunes:episode"] && item["itunes:episode"].cdata;
            chapter.url =
              item.enclosure &&
              item.enclosure.attributes &&
              item.enclosure.attributes.url;
            chapter.duration =
              item["itunes:duration"] && item["itunes:duration"].cdata;

            transformedData.audioTracks.chapters.push(chapter);
          });
        }
      }

      res.json(transformedData);
    })
    .catch(function (err) {
      let error = new Error(err);
      error.status = 404;
      next(error);
    });
};

module.exports = { convertXmlToJson };
