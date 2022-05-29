import Footer from "../../components/footer";
import { blogPost2 } from "../../lib/blogData"


export default function pollyNewsBlog({ title, date, content }) {
    
    return (
        <>
            <div>
                <head>
                    <title>{title}</title>
                </head>
                <main>
                    <h1>{title}</h1>
                    <div>{content}</div>
                </main>
            </div>
        
        </>
    )
}


export async function getStaticProps(context) {
    console.log("hi", context);
    const { params } = context;
    return {
        props: blogPost2.find((item) => item.slug === params.slug)
    };
}


    export async function getStaticPaths() {

        return {
            paths:  blogPost2.map((item) => ({
                params: { slug: item.slug },
            })),
            fallback: false
        };     
    }
