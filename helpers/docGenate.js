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
    categories,
    image
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
        categories,
        image
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

const generateUserDoc = ({ _id, firstName ,lastName ,email,imageURL,image})=>{
    return{
        _id,
        firstName ,
        lastName ,
        email,
        imageURL,
        image
        
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