const { ObjectId } = require('mongodb')
import clientPromise from './mongodb'
import logger from '../../logger/logger'

export async function runner(funcName,options){
    const client = await clientPromise
    //logger.info(funcName)
    //logger.info('this is mongoclient', client)

    try{
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
            case 'getOneBulletin':
                data = await getOneBulletin(client, ...options)
                break
            case 'updateBulletin':
                data = await updateBulletin(client, ...options)
                break
            case 'addComment':
                data = await addComment(client, ...options)
                break
            case 'getComments':
                data = await getComments(client, ...options)
                break
            default:
                throw "undefined function call"
        }

        if(!data){
            throw 'No information was returned'
        }

        return data

    }catch(err){
        logger.info('> dbbulletins.js/runner: An unexpected error occurred', err)
        return {
            success: false,
            error: err,
        }
    }finally{
        // await client.close()
    }
}


async function getBulletins(client, cityid, uid, per_page, objID){
    //logger.info('here are params', per_page, objID, typeof per_page, typeof objID)
    
    try{
        // perform db search here
        const bulletinDatabase = client.db('bulletin')
        let data = null

        if(objID !== '0'){  // not the inital load, need to order by id
            //logger.info('went through the typical!')
            data = await bulletinDatabase.collection('bulletinposts').aggregate([
                { $match:
                    { $and:
                        [
                            { city: cityid[3] },
                            { _id: { $lt: ObjectId(objID) } },
                        ]
                    }
                }, { $lookup: 
                    {
                        from: 'bulletincomments',
                        as: 'comments',
                        let: { local_field: '$_id' },
                        pipeline: [
                            { $match:
                                { $expr:
                                    {
                                        $eq: ['$bulletinpostID', '$$local_field']
                                    }
                                }
                            },
                            { $count: "numComments" },
                        ]
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
            ]).sort({"timestamp": -1}).limit(per_page).toArray()
        }else if(objID === '0'){
            //logger.info('went through init!')
            data = await bulletinDatabase.collection('bulletinposts').aggregate([
                { $match:
                    {
                        city: cityid[3],
                    }
                }, { $lookup: 
                    {
                        from: 'bulletincomments',
                        as: 'comments',
                        let: { local_field: '$_id' },
                        pipeline: [
                            { $match: 
                                { $expr: 
                                    {
                                        $eq: ['$bulletinpostID', '$$local_field']
                                    }
                                }
                            },
                            { $count: "numComments" },
                        ]
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
            ]).sort({"timestamp": -1}).limit(per_page).toArray()
        }

        //logger.info('this is the resulting data!', data)
                
        return {
            success: true,
            resdb: data, 
            error: false,
        }

    }catch(err){
        logger.info('> dbbulletins.js/getBulletins: ERROR', err)
        return {
            success: false,
            resdb: null,
            error: true
        }
    }
}


async function setVotes(client,postid=null,uid=null,vote=null,adjustmentup=null,adjustmentdown=null){
    if(postid===null || uid===null || vote===null || adjustmentup===null || adjustmentdown===null) return

    //logger.info('> dbbulletins.js/setVotes: Received:', {postid, uid, vote, adjustmentup, adjustmentdown})
    logger.info(postid, uid, vote, adjustmentup, adjustmentdown)
    const updateDocument = {
        $inc: {
            upvotes: adjustmentup,
            downvotes: adjustmentdown,
        }
    }

    try{
        const bulletinDatabase = client.db('bulletin')

        if(vote==="neither"){  // delete a document and update the post
            logger.info('case A')
            const delDocument = {
                user: ObjectId(uid),
                post: ObjectId(postid),
            }
            const delResult = await bulletinDatabase.collection('bulletinusers').deleteOne(delDocument)
            const updateResult = await bulletinDatabase.collection('bulletinposts').updateOne({"_id":ObjectId(postid)},updateDocument)
            logger.info('> dbbulletins/setVotes: DONGJI U NEED TO SEE THIS:', delResult, updateResult)
        }else{  // need to first check if a doc exists, else create one and update the post
            //logger.info('> dbbulletins/setVotes: case B')
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
            //logger.info('this is the doc to add', addDoc)
            const findResult = await bulletinDatabase.collection('bulletinusers').findOne(findQuery)
            if(findResult===null){
                const insertResult = await bulletinDatabase.collection('bulletinusers').insertOne(addDoc)
                //logger.info('PART ONE',insertResult)
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
                //logger.info('PART TWO',updateResultOne)
            }
            const updateResult = await bulletinDatabase.collection('bulletinposts').updateOne({"_id":ObjectId(postid)},updateDocument)
            //logger.info('PART THREE',updateResult)
        }

        return {
            success: true,
        }
    }catch(err){
        logger.info('> dbbulletins/setVotes: ERROR:', err)
        return { success: false, error: err, }
    }
}


async function createBulletin(client, upvotes=null, downvotes=null, statement=null, map=null, mapLink=null, city=null, timestamp=null, body=null, anon=null, attachments=[], user){
    logger.info('> dbbulletins.js/createBulletin: User Creating Bulletin:', user)
    const documentToAddInBulletinPosts = {
        upvotes: upvotes,
        downvotes: downvotes,
        statement: statement,
        map: map,
        mapLink: mapLink,
        city: city,
        timestamp: timestamp,
        body: body,
        attachments: attachments,
        author: {
            authorID: ObjectId(user.uid),
            authorName: (anon === 'true' || anon) ? "Anonymous" : user.username,
        },
    }

    try{
        const bulletinDatabase = client.db('bulletin')
        const insertResult = await bulletinDatabase.collection('bulletinposts').insertOne(documentToAddInBulletinPosts)
        //logger.info('DONGJI LOOK', insertResult.insertedId)
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

        documentToAddInBulletinPosts._id = newPostID
        documentToAddInBulletinPosts.comments = []
        documentToAddInBulletinPosts.useractions = [documentToAddInBulletinUsers]
        return { success: true, msg: null, bulletin: documentToAddInBulletinPosts }
    }catch(err){
        logger.info('> dbbulletins/createBulletin: creating a new post in dbbulletins failed!')
        return { success: false, msg: 'a database error occurred!' }
    }
}


async function removeBulletin(client, posttodelete){
    logger.info('> dbbulletins.js/removeBulletin: Post to delete:', posttodelete)

    try{
        const bulletinDatabase = client.db('bulletin')
        const deleteResultPosts = await bulletinDatabase.collection('bulletinposts').deleteOne({ _id: ObjectId(posttodelete) })
        const deleteResultUsers = await bulletinDatabase.collection('bulletinusers').deleteMany({ post: ObjectId(posttodelete) })
        const deleteResultComments = await bulletinDatabase.collection('bulletincomments').deleteMany({ bulletinpostID: ObjectId(posttodelete) })
        logger.info('> dbbulletins/removeBulletin:',deleteResultPosts,deleteResultUsers,deleteResultComments)

        
        if(deleteResultPosts.acknowledged && deleteResultPosts.deletedCount > 0 && deleteResultUsers.acknowledged && deleteResultComments.acknowledged){
            return { success: true, msg: null }    
        }else{
            throw 'no posts were deleted!'
        }
        
    }catch(err){
        logger.info('> dbbulletins/removeBulletin:',err)
        return { success: false, msg: 'deletion failed for post!' }
    }
}


async function getOneBulletin(client, postID, uid){
    logger.info('> dbbulletins.js/getOneBulletin: post to find:',postID)

    try{
        const bulletinDatabase = client.db('bulletin')
        let findResult  = await bulletinDatabase.collection('bulletinposts').aggregate([
            { $match:
                { 
                    _id: ObjectId(postID)
                }
            }, { $lookup: 
                {
                    from: 'bulletincomments',
                    as: 'comments',
                    let: { local_field: '$_id' },
                    pipeline: [
                        { $match: 
                            { $expr: 
                                {
                                    $eq: ['$bulletinpostID', '$$local_field']
                                }
                            }
                        },
                        { $count: "numComments" },
                    ]
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
        ]).toArray()
        
        
        if(findResult === null){
            throw 'Post not found!'
        }

        logger.info(findResult)
        return {
            success: true,
            data: findResult,
        }
    }catch(err){
        logger.info('> dbbulletins/getOneBulletin:',err)
        return { success: false, msg: 'Could not find post - an error occurred' }
    }
}

async function updateBulletin(client, postID, newTitle, newMap, newMapLink, newBody, newAnon, newFilenames){
    logger.info('> dbbulletins.js/updateBulletin', postID, newTitle, newMap, newMapLink, newBody, newAnon, newFilenames)

    try{
        const bulletinDatabase = client.db('bulletin')
        const filter = { _id: ObjectId(postID) }

        let newBulletin
        if(newAnon){
            newBulletin = {
                $set: {
                    statement: newTitle,
                    map: newMap,
                    mapLink: newMapLink,
                    body: newBody,
                    'author.authorName': 'Anonymous',
                    attachments: newFilenames,
                }
            }    
        }else{
            newBulletin = {
                $set: {
                    statement: newTitle,
                    map: newMap,
                    mapLink: newMapLink,
                    body: newBody,
                    attachments: newFilenames,
                }
            }    
        }
        
        const updateResult = await bulletinDatabase.collection('bulletinposts').updateOne(filter, newBulletin)

        return {
            success: true,
            msg: null,
        }
    }catch(err){
        logger.info('> dbbulletins/updateBulletin:',err)
        return { success: false, msg: 'Error updating post' }
    }
}

async function addComment(client, bulletinID, commentBody, authorID, authorName, timestamp){
    logger.info('> dbbulletins.js/addComment', bulletinID, commentBody, authorID, authorName, timestamp)
    const newComment = {
        bulletinpostID: ObjectId(bulletinID),
        comment: commentBody,
        author: {
            authorID: ObjectId(authorID),
            authorName: authorName,
        },
        timestamp: timestamp,
    }


    try{
        const bulletinDatabase = client.db('bulletin')
        const insertResult = await bulletinDatabase.collection('bulletincomments').insertOne(newComment)
        logger.info('> dbbulletins.js/addComment', insertResult)

        return {
            success: true,
            commentID: insertResult.insertedId,
            msg: null
        }
    }catch(err){
        logger.info('> dbbulletins/addComment:',err)
        return { success: false, msg: 'Error adding comment' }
    }
}

async function getComments(client, postid, perpage, objid){
    logger.info('> dbbulletins.js/getComments:', postid, perpage, objid)
    try{
        const bulletinDatabase = client.db('bulletin')
        let data = null

        if(objid !== '0'){  // not the inital load, need to order by id
            //logger.info('went through the typical!')
            data = await bulletinDatabase.collection('bulletincomments').aggregate([
                { $match:
                    { $and:
                        [
                            { bulletinpostID: ObjectId(postid) },
                            { _id: { $lt: ObjectId(objid) } },
                        ]
                    }
                },
                { $sort: { _id: -1 }},
                { $limit: perpage },
            ]).toArray()
        }else if(objid === '0'){
            logger.info('went through init!')
            data = await bulletinDatabase.collection('bulletincomments').aggregate([
                { $match:
                    {
                        bulletinpostID: ObjectId(postid),
                    }
                },
                { $sort: { _id: -1 }}, // same as sorting by timestamp iirc
                { $limit: perpage },
            ]).toArray()
        }

        return {
            success: true,
            resdb: data, 
            error: false,
        }
    }catch(err){
        logger.info('> dbbulletins.js/getComments: ERROR', err)
        return {
            success: false,
            resdb: null,
            error: true
        }
    }
}