const { MongoClient, ObjectId } = require('mongodb')
const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)

export async function getBulletins(cityid, uid){
    try{
        await client.connect()
        await client.db("admin").command({ ping: 1 })
        console.log('bulletin.js: connected to database!')

        // perform db search here
        const bulletinDatabase = client.db('bulletin')
        const data = await bulletinDatabase.collection('bulletinposts').aggregate([
            { $match:
                {
                    city: cityid[3],
                }
            }, { $lookup: 
                {
                    from: 'bulletincomments',
                    localField: '_id',
                    foreignField: 'bulletinpostID',
                    as: 'comments',
                }
            }, { $lookup:
                {
                    from: 'bulletinusers',
                    let: {
                        postid: '$_id',
                    },
                    pipeline: [
                        { $match:
                            { $expr: 
                                { $and:
                                    [
                                        { $eq: ["$user", ObjectId(uid)]},
                                        { $eq: ["$post", "$$postid"]},
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'useractions',
                }
            },
        ]).sort({"upvotes": -1}).limit(10).toArray()
                
        return { resdb: data, error: false }

    }catch(err){
        console.log("SHIT")
        return { resdb: null, error: true }

    }finally{
        await client.close()
        console.log('MONGODB Connection CLOSED')

    }
}

export async function setVotes(postid=null,uid=null,vote=null,adjustmentup=null,adjustmentdown=null){
    if(postid===null || uid===null || vote===null || adjustmentup===null || adjustmentdown===null) return

    console.log('this is the backend lib file!',postid, uid, vote, adjustmentup, adjustmentdown)
    const updateDocument = {
        $inc: {
            upvotes: adjustmentup,
            downvotes: adjustmentdown,
        }
    }

    try{
        await client.connect()
        await client.db("admin").command({ ping: 1 })
        console.log('bulletin.js: connected to database!')
        const bulletinDatabase = client.db('bulletin')

        if(vote==="neither"){  // delete a document and update the post
            console.log('case A')
            const delDocument = {
                user: ObjectId(uid),
                post: ObjectId(postid),
            }
            const delResult = await bulletinDatabase.collection('bulletinusers').deleteOne(delDocument)
            const updateResult = await bulletinDatabase.collection('bulletinposts').updateOne({"_id":ObjectId(postid)},updateDocument)
        }else{  // need to first check if a doc exists, else create one and update the post
            console.log('case B')
            const findQuery = {
                user: ObjectId(uid),
                post: ObjectId(postid),
            }
            const addDoc = {
                user: ObjectId(uid),
                post: ObjectId(postid),
                action: {
                    upvote: vote==="upvote"?true:false,
                    downvote: vote==="downvote"?true:false,
                }
            }
            console.log('this is the doc to add', addDoc)
            const findResult = await bulletinDatabase.collection('bulletinusers').findOne(findQuery)
            if(findResult===null){
                const insertResult = await bulletinDatabase.collection('bulletinusers').insertOne(addDoc)
            }else{  // just need to update it 
                const updateResultOne = await bulletinDatabase.collection('bulletinusers').updateOne({
                    post: ObjectId(postid),
                    user: ObjectId(uid),
                }, {
                    $set: {
                        "action.upvote": vote==="upvote"?true:false,
                        "action.downvote": vote==="downvote"?true:false,
                    }
                })
            }
            const updateResult = await bulletinDatabase.collection('bulletinposts').updateOne({"_id":ObjectId(postid)},updateDocument)
        }

        return {
            success: true,
        }
    }catch(err){
        console.log('oopsie poopsie!', err)
        return { success: false }
    }finally{
        await client.close()
        console.log('MONGODB Connection CLOSED')
    }
}

export async function createBulletin(upvotes=null, downvotes=null, statement=null, map=null, mapLink=null, city=null, timestamp=null, body=null){
    const documentToAdd = {
        upvotes: upvotes,
        downvotes: downvotes,
        statement: statement,
        map: map,
        mapLink: mapLink,
        city: city,
        timestamp: timestamp,
        body: body,
    }

    try{
        await client.connect()
        await client.db("admin").command({ ping: 1 })
        console.log('bulletin.js: connected to database!')

        const bulletinDatabase = client.db('bulletin')
        const insertResult = await bulletinDatabase.collection('bulletinposts').insertOne(documentToAdd)

        return { success: true, msg: null }
    }catch(err){
        console.log('creating a new post in dbbulletins failed!')
        return { success: false, msg: 'a database error occurred!' }
    }finally{
        await client.close()
        console.log('MONGODB Connection CLOSED')
    }
}