import { Member } from "../models/Member";

export const memberCtrl = {
  async getAllMembers(req, res) {
    try {
      const totalMembers = await Member.find().exec();
      const totalLength = totalMembers.length;
      const members = await Member.find()
        .sort(
          req.query.sort
            ? { [req.query.sort]: req.query.order === "ASC" ? 1 : -1 }
            : {}
        )
        .limit(req.query.perPage ? parseInt(req.query.perPage) : 0)
        .skip(
          req.query.page && req.query.perPage
            ? (parseInt(req.query.page) - 1) * parseInt(req.query.perPage)
            : 0
        )
        .populate("groups")
        .exec();
      res.status(200).set("X-Total-Count", totalLength).json(members);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  getMemberById(req, res) {
    Member.findOne({ _id: req.params.id })
      .populate("groups")
      .then((member) => res.status(200).json(member))
      .catch((error) => res.status(404).json({ error }));
  },
};
