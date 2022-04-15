const { MongoClient, ObjectId } = require('mongodb')
const url = process.env.MONGO_URL


export async function runner(funcName,options){
    const client = new MongoClient(url)

    try{
        await client.connect()

        var data = null
        switch(funcName){
            case 'getBulletins':
                data = await getBulletins(client, ...options)
                break
            case 'setVotes':
                data = await setVotes(client, ...options)
                break
            case 'createBulletin':
                data = await createBulletin(client, ...options)
                break
            case 'removeBulletin':
                data = await removeBulletin(client, ...options)
                break
            default:
                throw "undefined function call"
        }

        if(!data){
            throw 'No information was returned'
        }

        return data

    }catch(err){
        console.log('> dbbulletins.js/runner: An unexpected error occurred', err)
        return {
            success: false,
            error: err,
        }
    }finally{
        await client.close()
    }
}


async function getBulletins(client, cityid, uid, per_page, page){
    try{
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
        ]).sort({"timestamp": -1}).skip(per_page*(page-1)).limit(per_page).toArray()
                
        return {
            success: true,
            resdb: data, 
            error: false,
        }

    }catch(err){
        console.log('> dbbulletins.js/getBulletins: ERROR', err)
        return {
            success: false,
            resdb: null,
            error: true
        }
    }
}


async function setVotes(client,postid=null,uid=null,vote=null,adjustmentup=null,adjustmentdown=null){
    if(postid===null || uid===null || vote===null || adjustmentup===null || adjustmentdown===null) return

    console.log('> dbbulletins.js/setVotes: Received:',postid, uid, vote, adjustmentup, adjustmentdown)
    const updateDocument = {
        $inc: {
            upvotes: adjustmentup,
            downvotes: adjustmentdown,
        }
    }

    try{
        const bulletinDatabase = client.db('bulletin')

        if(vote==="neither"){  // delete a document and update the post
            console.log('case A')
            const delDocument = {
                user: ObjectId(uid),
                post: ObjectId(postid),
            }
            const delResult = await bulletinDatabase.collection('bulletinusers').deleteOne(delDocument)
            const updateResult = await bulletinDatabase.collection('bulletinposts').updateOne({"_id":ObjectId(postid)},updateDocument)
            console.log('> dbbulletins/setVotes: DONGJI U NEED TO SEE THIS:', delResult, updateResult)
        }else{  // need to first check if a doc exists, else create one and update the post
            //console.log('> dbbulletins/setVotes: case B')
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
            //console.log('this is the doc to add', addDoc)
            const findResult = await bulletinDatabase.collection('bulletinusers').findOne(findQuery)
            if(findResult===null){
                const insertResult = await bulletinDatabase.collection('bulletinusers').insertOne(addDoc)
                //console.log('PART ONE',insertResult)
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
                //console.log('PART TWO',updateResultOne)
            }
            const updateResult = await bulletinDatabase.collection('bulletinposts').updateOne({"_id":ObjectId(postid)},updateDocument)
            //console.log('PART THREE',updateResult)
        }

        return {
            success: true,
        }
    }catch(err){
        console.log('> dbbulletins/setVotes: ERROR:', err)
        return { success: false, error: err, }
    }
}


async function createBulletin(client, upvotes=null, downvotes=null, statement=null, map=null, mapLink=null, city=null, timestamp=null, body=null, user){
    console.log('> dbbulletins.js/createBulletin: User Creating Bulletin:', user)
    const documentToAddInBulletinPosts = {
        upvotes: upvotes,
        downvotes: downvotes,
        statement: statement,
        map: map,
        mapLink: mapLink,
        city: city,
        timestamp: timestamp,
        body: body,
        author: {
            authorID: ObjectId(user.uid),
            authorName: user.username,
        },
    }

    try{
        const bulletinDatabase = client.db('bulletin')
        const insertResult = await bulletinDatabase.collection('bulletinposts').insertOne(documentToAddInBulletinPosts)
        //console.log('DONGJI LOOK', insertResult.insertedId)
        const newPostID = insertResult.insertedId
        const documentToAddInBulletinUsers = {
            user: ObjectId(user.uid),
            post: ObjectId(newPostID),
            action: {
                upvote: true,
                downvote: false,
            }
        }
        const insertResultTwo = await bulletinDatabase.collection('bulletinusers').insertOne(documentToAddInBulletinUsers)

        return { success: true, msg: null }
    }catch(err){
        console.log('> dbbulletins/createBulletin: creating a new post in dbbulletins failed!')
        return { success: false, msg: 'a database error occurred!' }
    }
}


async function removeBulletin(client, posttodelete){
    console.log('> dbbulletins.js/removeBulletin: Post to delete:', posttodelete)

    try{
        const bulletinDatabase = client.db('bulletin')
        const deleteResultPosts = await bulletinDatabase.collection('bulletinposts').deleteOne({ _id: ObjectId(posttodelete) })
        const deleteResultUsers = await bulletinDatabase.collection('bulletinusers').deleteMany({ post: ObjectId(posttodelete) })
        console.log('> dbbulletins/removeBulletin:',deleteResultPosts,deleteResultUsers)

        
        if(deleteResultPosts.acknowledged && deleteResultPosts.deletedCount > 0 && deleteResultUsers.acknowledged){
            return { success: true, msg: null }    
        }else{
            throw 'no posts were deleted!'
        }
        
    }catch(err){
        console.log('> dbbulletins/removeBulletin:',err)
        return { success: false, msg: 'deletion failed for post!' }
    }
}