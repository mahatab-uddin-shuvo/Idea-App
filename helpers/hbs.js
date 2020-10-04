const compareValues = (value1,value2)=>{
    return value1 === value2 && 'selected';
}

const truncateContent = (content,number) => {
    if(content.length < number){
     return content;
    } else{
        return content.slice(0,number) + '....';
    }

}

const comparePath = (lPath, rPath) => {
    return lPath === rPath && 'active';
};

module.exports = {
    compareValues,
    truncateContent,
    comparePath
}