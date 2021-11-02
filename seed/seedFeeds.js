import { LoremIpsum } from "lorem-ipsum";
import { Member } from "../server/models/Member";
import { Feed } from "../server/models/Feed";

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 6,
    min: 2,
  },
  wordsPerSentence: {
    max: 12,
    min: 4,
  },
});

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
      message: lorem.generateParagraphs(1),
      story: lorem.generateParagraphs(1),
      pictureLink: `https://picsum.photos/${
        Math.floor(Math.random() * 200) + 100
      }/${Math.floor(Math.random() * 200) + 100}`,
    });
    await feed.save();
  }
};
