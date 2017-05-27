const router = require('express').Router()

module.exports = (controllers, middlewares) => {
  const postController = controllers.postController
  const authMiddleware = middlewares.authMiddleware

  return router
    .post('/comment/:postId', authMiddleware.isAuthenticated(), postController.commentPostById)
    .post('/like/:postId', authMiddleware.isAuthenticated(), postController.likePostById)
    .post('/unlike/:postId', authMiddleware.isAuthenticated(), postController.unLikePostById)
    .delete('/delete/:postId', authMiddleware.isAuthenticated(), postController.deletePostById)
    .post('/edit/:postId', authMiddleware.isAuthenticated(), postController.editPostById)
    .get('/comments/:postId', postController.getPostCommentsByPostId)
    .get('/post/:postId', authMiddleware.extractUserFromToken(), postController.getPostById)
    .get('/explore', authMiddleware.extractUserFromToken(), postController.getExplorePosts)
    .get('/:username', authMiddleware.extractUserFromToken(), postController.getUserPosts)
    .get('/tag/:tag', authMiddleware.extractUserFromToken(), postController.getTagPosts)
}
