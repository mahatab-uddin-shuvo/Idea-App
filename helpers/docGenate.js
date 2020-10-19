const  generateIdeaDoc = function generateIdeaDoc ({
    _id, 
    title, 
    description, 
    allowComments, 
    status,
    tags,
    comments,
    user,
    createdAt,
    updatedAt,
    categories
}) {
    return {
        _id,
        title,
        description,
        allowComments,
        status,
        tags,
        comments,
        user,
        createdAt,
        updatedAt,
        categories
    }
}

const generateCommentDoc = ({_id,title,text,user,createdAt,updatedAt})=>{
    return{
        _id,
        title,
        text,
        user,
        createdAt,
        updatedAt
    }
}

const generateUserDoc = ({ _id, firesName ,lastName ,email})=>{
    return{
        _id,
        firesName ,
        lastName ,
        email
    };
};

const generateCategoryDoc=({_id,category,categoryName})=>{
    return{
        _id,
        category,
        categoryName
    }
}

module.exports = {
    generateIdeaDoc,
    generateCommentDoc,
    generateUserDoc,
    generateCategoryDoc
}