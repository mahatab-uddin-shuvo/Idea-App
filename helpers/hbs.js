const {format} = require('date-fns')

const compareValues = (value1,value2,value3)=>{
    switch(value3){
        case 'select':
            return value1 === value2 && 'selected';
            break;

        case 'path' :
            return value1 === value2 && 'active';
            break;

        case 'btn':  
            return value1.equals(value2) ? 'block' : 'none';
            break;

        default:
    }   
}

const truncateContent = (content,number) => {
    if(content.length < number){
     return content;
    } else{
        return content.slice(0,number) + '....';
    }

}


const formatDate = (date,toFormat)=>{
return format(date , toFormat);
}

module.exports = {
    compareValues,
    truncateContent,
    formatDate
}