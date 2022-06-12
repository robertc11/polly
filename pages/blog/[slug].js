import Footer from "../../components/footer";
//import { blogPost2 } from "../../lib/blogData"
import { getAllPosts } from '../../lib/blogData'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'



export default function pollyNewsBlog({ title, date, content }) {
    const hydratedconent = MDXRemote(content)

    return (
        <>
            <div>
                <head>
                    <title>{title}</title>
                </head>
                <main>
                    <div className="border-b-2 border-gray-200 mb-4">
                        <h2 className="text-2xl font-bold">{title}</h2>

                        <div className="text-gray-600 text-md">{date}</div>
                    </div>
                    <div className="prose lg:prose-xl">{hydratedconent}</div>

                </main>

            </div>

        </>
    )
}


export async function getStaticProps(context) {
    const { params } = context;
    const allPosts = getAllPosts();
    //console.log("hi", context);
    const { data, content } = allPosts.find((item) => item.slug === params.slug)
    const mdxSource = await serialize(content)
    console.log(data, content)
    //const { params } = context;
    return {

        props: {
            ...data,
            date: data.date,
            content: mdxSource,

        }
    };
}


export async function getStaticPaths() {
    const allPosts = getAllPosts();
    console.log(allPosts)
    return {
        paths: getAllPosts().map((post) => ({
            params: {
                slug: post.slug
            },
        })),
        fallback: false
    };
}
