import { render } from 'react-dom'
import BlockY from '../components/blockY'
import NavBar from '../components/navbar'
import { blogPost2 } from '../lib/blogData'
import Head from 'next/head';
import Link from 'next/link';



export default function blogHome() {



        return (
                <div>
                        <head>
                                <title>Polly Blog Home</title>
                        </head>
                        <NavBar />
                        <div>
                                <h1 className="mt-10 mb-5 text-5xl text-transparent w-full text-center bg-clip-text bg-gradient-to-r from-violet-300 to-indigo-700 font-bold">Blog Home.</h1>
                        </div>
                        <BlockY>
                        <div className="space-y-4">

                               
                                        {blogPost2.map((item) => (
                                                <BlogPostItem key={item.slug} {...item} />
                                        ))}
                                
                        </div>
                        </BlockY>
                </div>


        );
                                        }



         function  BlogPostItem({ slug, title, date, content }) {
                 return(

                        <div className=" border hover:border-purple-400 shadow rounded w-11/12 mx-auto text-left text-md text-slate-800 leading-6 text-slate-600 font-semibold ">
                <div >
                        <div className="cursor-pointer hover:text-violet-600"><Link href={`/blog/${slug}`}><a>{title}</a></Link> </div>
                        <div>{date.toString()}</div>
                        <div>{content}</div>
                </div>
                </div>


        );
}


