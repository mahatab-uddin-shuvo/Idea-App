module.exports = function genarateIdeaDoc(id, title, description, allowComments, status) {
    return {
        id,
        title,
        description,
        allowComments,
        status
    }
}