const router = require('express').Router()

module.exports = (controllers, middlewares) => {
  const postController = controllers.postController
  const pictureMiddleware = middlewares.pictureMiddleware
  const authMiddleware = middlewares.authMiddleware

  router
    .post('/upload', pictureMiddleware.uploadSingle('pictureFile'), authMiddleware.isAuthenticated(), postController.uploadPicture)
    .post('/comment/:pictureId', authMiddleware.isAuthenticated(), postController.commentPostById)
    .post('/like/:pictureId', authMiddleware.isAuthenticated(), postController.likePostById)
    .post('/unlike/:pictureId', authMiddleware.isAuthenticated(), postController.unLikePostById)
    .get('/comments/:pictureId', postController.getPostCommentsById)
    .get('/:size/:pictureId', postController.getPictureById)
    .get('/explore', authMiddleware.extractUserFromToken(), postController.getExplorePosts)
    .get('/:username', authMiddleware.extractUserFromToken(), postController.getPostsByUsername)
  /*TODO Fix this route path*/


  return router
}

