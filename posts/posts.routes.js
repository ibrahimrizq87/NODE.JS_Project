import { Router } from "express";
const postRoutes = Router();
import postController from './posts.controller.js';


postRoutes.get('/posts',postController.getAllPosts)

postRoutes.delete('/posts/:uid/:pid',postController.deletePost)

postRoutes.post('/posts',postController.addPost)

postRoutes.put('/posts/:uid/:pid',postController.updatePost)

postRoutes.get('/sortedPosts',postController.getPostesSorted)

postRoutes.get('/posts/owner',postController.getAllPostsWithOwner)

export default postRoutes;
