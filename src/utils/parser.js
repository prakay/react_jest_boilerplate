import Parser from "rss-parser";

export default async xml => {
  const parser = new Parser();

  const res = await parser.parseString(xml);

  return res;
};
