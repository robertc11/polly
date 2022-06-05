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
                <div className="border-b-2 border-gray-200 mb-4">
                    <h2 className="text-2xl font-bold">{title}</h2>
                   
                    <div className="text-gray-600 text-md">{date}</div>
                    </div>
                    <div className="">{content}</div>
            
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
