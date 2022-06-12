import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export function getAllPosts() {
    console.log("rob got here")
    console.log(contentDirectory)
    const allPosts = fs.readdirSync(contentDirectory)
    console.log(allPosts)

    return allPosts.map(fileName => {
        const slug = fileName.replace('.md', '')
        const fileContents = fs.readFileSync(
            path.join(contentDirectory, fileName),
            'utf8',
        )
        const { data, content } = matter(fileContents)

        return {

            data,
            content,
            slug
        }

    })

}

// export const blogPost2 = [

// {
//     title: 'Election Hide-And-Seek 1',
//     slug: 'first',
//     date: new Date().toString(),
//     content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."
//     },

// {
//     title: 'Election Hide-And-Seek 2',
//     slug: 'second',
//      date: new Date().toString(),
//      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."
//     },

//     {
//         title: 'Election Hide-And-Seek 3',
//         slug: 'third',
//          date: new Date().toString(),
//          content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."
//         },

// ];

// export default {
//     blogPosts
// };