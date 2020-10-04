const  generateIdeaDoc = (id, title, description, allowComments, status,tags,comments)=>{
    return {
        id,
        title,
        description,
        allowComments,
        status,
        tags,
        comments
    }
}

const generateCommentDoc = (id,title,text)=>{
    return{
        id,
        title,
        text
    }
}

module.exports = {
    generateIdeaDoc,
    generateCommentDoc
}