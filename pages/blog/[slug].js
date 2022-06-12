import Footer from "../../components/footer";
//import { blogPost2 } from "../../lib/blogData"
import { getAllPosts } from '../../lib/blogData'


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
    const { params } = context;
    const allPosts =  getAllPosts();
    //console.log("hi", context);
    const {data, content} = allPosts.find((item) => item.slug === params.slug)
   console.log(data, content)
    //const { params } = context;
    return {

        props: {
            ...data,
            date: data.date,
            content,

        }  
    };
}


    export async function getStaticPaths() {
      const allPosts =  getAllPosts();
      console.log(allPosts)
        return {
            paths:  getAllPosts().map((post) => ({
                params: { 
                    slug: post.slug 
                },
            })),
            fallback: false
        };     
    }
