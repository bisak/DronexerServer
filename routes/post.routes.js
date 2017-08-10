const router = require('express').Router()
const errorCatcher = require('../util').errorCatcher

module.exports = (controllers, middlewares) => {
  const postController = controllers.postController
  const authMiddleware = middlewares.authMiddleware

  return router
    .post('/comment/:postId', authMiddleware.isAuthenticated(), errorCatcher(postController.commentPostById))
    .post('/like/:postId', authMiddleware.isAuthenticated(), errorCatcher(postController.likePostById))
    .post('/unlike/:postId', authMiddleware.isAuthenticated(), errorCatcher(postController.unLikePostById))
    .delete('/delete/:postId', authMiddleware.isAuthenticated(), errorCatcher(postController.deletePostById))
    .post('/edit/:postId', authMiddleware.isAuthenticated(), errorCatcher(postController.editPostById))
    .get('/comments/:postId', errorCatcher(postController.getPostCommentsByPostId))
    .get('/post/:postId', authMiddleware.extractUserFromToken(), errorCatcher(postController.getPostById))
    .get('/explore', authMiddleware.extractUserFromToken(), errorCatcher(postController.getExplorePosts))
    .get('/feed', authMiddleware.isAuthenticated(), errorCatcher(postController.getFeedPosts))
    .get('/:username', authMiddleware.extractUserFromToken(), errorCatcher(postController.getUserPosts))
    .get('/tag/:tag', authMiddleware.extractUserFromToken(), errorCatcher(postController.getTagPosts))
}
