const Thing = require("../models/thing");
const fs = require("fs");

exports.createThing = (req, res, next) => {
  const thingObject = JSON.parse(req.body.thing);
  delete thingObject._id;
  delete thingObject.userId;

  const thing = new Thing({
    ...thingObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  thing
    .save()
    .then(() => {
      res.status(201).json({ message: "Objet enregistre" });
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.getAllThings = (req, res, next) => {
  Thing.find()
    .then((things) => res.status(200).json(things))
    .catch((error) => error);
};

exports.getThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then((thing) => res.status(200).json(thing))
    .catch((error) => res.status(400).json(error));
};

exports.modifyThing = (req, res, next) => {
  const thingObject = req.file
    ? {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete thingObject.userId;
  Thing.findOne({ _id: req.params.id }).then((thing) => {
    if (thing.userId != req.auth.userId) {
      res.status(401).json({ message: "Non-autorise" });
    } else {
      Thing.updateOne(
        { _id: req.params.id },
        { ...thingObject, _id: req.params.id }
      )
        .then(() => res.status(200).json({ message: "Objet modifie" }))
        .catch((error) => res.status(400).json({ error }));
    }
  });
};

exports.deleteThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then((thing) => {
      if (thing.userId != req.auth.userId) {
        res.status(401).json({ message: "Non-autorise" });
      } else {
        const filename = thing.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Thing.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprime" });
            })
            .catch((error) => {
              res.status(400).json({ error });
            });
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
