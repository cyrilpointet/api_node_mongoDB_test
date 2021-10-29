import { Member } from "../models/Member";
import { Feed } from "../models/Feed";

export const seedFeeds = async () => {
  const feeds = await Feed.find();
  for (let i = 0; i < feeds.length; i++) {
    feeds[i].remove();
  }

  const members = await Member.find();

  for (let i = 0; i < members.length; i++) {
    const feed = new Feed({
      type: "coucou",
      group: members[i].groups[0],
      author: members[i]._id,
    });
    await feed.save();
  }
};
