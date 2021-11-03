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
  await Feed.deleteMany({});

  const members = await Member.find();

  for (let i = 0; i < members.length; i++) {
    const feed = new Feed({
      ogId: "temp",
      type: "coucou",
      group: members[i].groups[0],
      author: members[i],
      message: lorem.generateParagraphs(1),
      story: lorem.generateParagraphs(1),
      pictureLink: `https://picsum.photos/${
        Math.floor(Math.random() * 200) + 100
      }/${Math.floor(Math.random() * 200) + 100}`,
    });
    feed.ogId = feed._id;
    await feed.save();
  }
};
