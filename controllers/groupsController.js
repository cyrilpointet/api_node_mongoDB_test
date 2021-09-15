import { Group } from "../models/Group";

export const groupCtrl = {
  async getAllGroups(req, res) {
    try {
      const totalGroups = await Group.find().exec();
      const totalLength = totalGroups.length;
      const groups = await Group.find()
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
        .populate("members")
        .exec();
      res.status(200).set("X-Total-Count", totalLength).json(groups);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  getGroupById(req, res) {
    Group.findOne({ _id: req.params.id })
      .populate("members")
      .then((group) => res.status(200).json(group))
      .catch((error) => res.status(404).json({ error }));
  },

  async deleteGroup(req, res) {
    try {
      const group = await Group.findOne({ _id: req.params.id });
      const resp = await group.remove();
      res.status(200).json(resp);
    } catch (error) {
      res.status(400).json({ error });
    }
  },
};
