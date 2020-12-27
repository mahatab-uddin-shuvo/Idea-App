const categoryForm = document.querySelector('#categoryForm');
const categoryInput = document.querySelector('#category');
const catMsg = document.querySelector('.catMsg');
const msg = document.querySelector('.msg');
const categories = document.querySelector('.categories');
const likeBtn = document.querySelector('.like-btn');
const likeCount = document.querySelector('.like-count');
const commentCount = document.querySelector('.comment-count');
const userId = document.querySelector('.user-id');
 
// Read the CSRF token from the <meta> tag
var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
 

function showMessage(info) {
  if (info.success) {
    msg.innerHTML =
       `<div class="alert alert-success">
          ${info.message}
          </div>`;
  } else {
    msg.innerHTML = 
          `<div class="alert alert-danger">
          ${info.message}
          </div>`;
  }
}


function showCategories(catsResult) {
  const result = catsResult.map(
    ({ category }) => `<span class="badge badge-primary" 
     data-name='${category}'>${category} <i class="fa fa-trash ml-2"></i> </span>`)
  if (categories) {
    categories.innerHTML = result.join('   ')
  }
}

async function deleteCategory(catName) {
  const response = await fetch(`/categories/${catName}`, {
    headers:{
      'CSRF-Token': token
    },
    method: 'DELETE'
  })
  return await response.json()
}

async function addCategory(data) {

  try {
    const response = await fetch('/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': token
      },
      body: JSON.stringify(data)
    })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}

async function getCategories() {
  try {
    const response = await fetch('/categories');
    return response.json();
  } catch (err) {
    console.log(err)
  }
}

if (categories) {
  categories.addEventListener('click', async (e) => {
    console.log(e.target);
    if (e.target.classList.contains('fa')) {
      const catName = e.target.parentElement.dataset.name;
      try {
        const result = await deleteCategory(catName);
        if (result.success) {
          msg.innerHTML =
            `<div class="alert alert-success">
           ${result.message}
           </div>`;
          //get all categories after deletion success
          const categoriesResult = await getCategories();
          //show all categories in the views
          showCategories(categoriesResult.categories)
        } else {
          msg.innerHTML =
            `<div class="alert alert-danger">
           ${result.message}
           </div>`;
        }
      } catch (err) {
        console.log(err)
      }
    }
  })
}


if (categoryForm) {
  categoryForm.addEventListener('submit', async (e) => {

    const categoryName = categoryInput.value
    //event prevent form submission event
    e.preventDefault();
    //clear out the input value
    categoryInput.value = '';

    try {
      //add a category
      const result = await addCategory({ category: categoryName });
      if (result.success) {
        msg.innerHTML = `
         <div class="alert alert-success">
         ${result.message}
         </div>`;
        //get all categories
        const categoriesResult = await getCategories();
        if (categoriesResult.success) {
          showCategories(categoriesResult.categories)
        } else {
          console.log('some problem')
        }
      } else {
        msg.innerHTML =
          `<div class="alert alert-danger">
      ${result.message}
      </div>`;
        const categoriesResult = await getCategories();
        if (categoriesResult.success) {
          showCategories(categoriesResult.categories)
        }
      }
    } catch (err) {
      console.log(err)
    }
  })

}




async function addLike(id, userId) {
  try {
    const response = await fetch(`/ideas/${id}/likes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': token
      },
      body: JSON.stringify({
        userId
      })
    })
    return await response.json()
  } catch (err) {
    showMessage({
      success: false,
      message: 'Some error ocurred in the server'
    });
  }
}

async function getLikeCount(id) {
  try {
    const response = await fetch(`/ideas/${id}/likes`);
    return await response.json()
  } catch (err) {
    showMessage({
      success: false,
      message: 'Some error ocurred in the server'
    });
  }
}
async function getCommentCount(id) {
  try {
    const response = await fetch(`/ideas/${id}/comments`);
    return await response.json();
  } catch (err) {
    showMessage({
      success: false,
      message: 'Some error ocurred in the server'
    });
  }
}
function showLikeCount({ data }) {
  likeCount.innerHTML = data
}
function showCommentCount({ data }) {
  commentCount.innerHTML = data
}

if (likeBtn) {
  likeBtn.addEventListener('click', async (e) => {
    const ideaId = e.target.dataset.id
    const user = userId.dataset.id
    if (!user) {
      showMessage({
        success: false,
        message: `please <a href = "/auth/login">Login</a> to the like idea`
      })
      return;
    }
    try {
      const result = await addLike(ideaId, user)
      console.log(result)
      //show message
      showMessage(result);
      const countResult = await getLikeCount(ideaId);
      if (countResult.success) {
        showLikeCount(countResult)
      } else {
        //show message
        showMessage(countResult);
      }
    } catch (err) {
      showMessage({
        success: false,
        message: 'Some error ocurred in the server'
      });    
    }
  })
}

async function run() {
  let ideaId;
  try {
    //get like count initial load
    if(likeBtn){
      ideaId = likeBtn.dataset.id
     //get like count
      const likesResult = await getLikeCount(ideaId);
      console.log(likesResult)
      if(likesResult.success){
        //showing like count
        showLikeCount(likesResult)
      }else{
        //show message
        showMessage(likesResult)
      }
    }
    
    if(commentCount){
   //get comment count initial load
      const commentResult = await getCommentCount(ideaId)
 
      if(commentResult.success){
        showCommentCount(commentResult)
      }else{
        //show message
        showMessage(commentResult)
      }
    }

    // get all category
    const categoriesResult = await getCategories();
    if (categoriesResult.success) {
      showCategories(categoriesResult.categories)
    }
  } catch (err) {
    showMessage({
      success: false,
      message: 'Some error ocurred in the server'
    });
  }
}

run()
