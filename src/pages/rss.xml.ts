import rss from "@astrojs/rss";
import { SITE_DESCRIPTION, SITE_TITLE } from "../consts";
import { getPostPath, getPublishedPosts } from "../utils/posts";

export async function GET(context: { site?: URL }) {
  const posts = await getPublishedPosts();

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description || post.data.title,
      pubDate: post.data.date,
      link: getPostPath(post),
      categories: post.data.tags,
    })),
    customData: `<language>en-us</language>`,
  });
}
