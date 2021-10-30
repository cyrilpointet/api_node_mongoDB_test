import axios from "axios";
import { Member } from "../models/Member";
import { Feed } from "../models/Feed";

export const seedFeeds = async () => {
  const feeds = await Feed.find();
  for (let i = 0; i < feeds.length; i++) {
    feeds[i].remove();
  }

  const members = await Member.find();
  const rawText = await axios.get(
    "https://baconipsum.com/api/?type=meat-and-filler&paras=1"
  );
  const text = rawText.data[0];

  for (let i = 0; i < members.length; i++) {
    const feed = new Feed({
      type: "coucou",
      group: members[i].groups[0],
      author: members[i]._id,
      message: text.substr(1, 100),
      story: text.substr(1, 40),
      pictureLink: `https://picsum.photos/${
        Math.floor(Math.random() * 200) + 100
      }/${Math.floor(Math.random() * 200) + 100}`,
    });
    await feed.save();
  }
};
