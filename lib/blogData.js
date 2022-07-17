import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

// read markodown files from directory and convert string into object
export function getAllPosts() {
    //console.log("rob got here")
    //console.log(contentDirectory)
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
