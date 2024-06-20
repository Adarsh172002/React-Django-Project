import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faComment, faShare, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../AuthContext'; 
import Modal from 'react-modal';

const Post = () => {
  const { token, refreshAccessToken } = useAuth(); 
  const [posts, setPosts] = useState([]);
  const [newComment, setNewComment] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({ text: '', image: null });

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/posts/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      if (error.response && error.response.status === 401) {
        // Token expired, try to refresh it
        try {
          await refreshAccessToken();
          const refreshedToken = localStorage.getItem('token'); // Get the updated token
          const response = await axios.get('http://127.0.0.1:8000/api/posts/', {
            headers: {
              Authorization: `Bearer ${refreshedToken}`
            }
          });
          setPosts(response.data);
        } catch (refreshError) {
          console.error('Failed to refresh token:', refreshError);
          // Handle logout or redirect to login page
        }
      }
    }
  };

  useEffect(() => {
    if (token) {
      fetchPosts();
    }
  }, [token, refreshAccessToken]);


  const handleLikePost = async (postId) => {
    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/like/${postId}/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data);
      const updatedPosts = posts.map(post => post.id === postId ? { ...post, liked: response.data.liked, like_count: response.data.like_count } : post);
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleCommentChange = (postId, value) => {
    setNewComment((prev) => ({
      ...prev,
      [postId]: value
    }));
  };

  const handleCommentSubmit = async (postId) => {
    const commentText = newComment[postId];
    if (!commentText) return;

    const commentData = {
      post: postId,
      text: commentText
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/comments/', commentData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Comment submitted:', response.data);

      // Refetch posts to get the latest comments
      await fetchPosts();

      // Optionally, clear the comment input
      setNewComment((prev) => ({
        ...prev,
        [postId]: ''
      }));
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleNewPostChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files.length > 0) {
      setNewPost((prev) => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setNewPost((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNewPostSubmit = async () => {
    const formData = new FormData();
    formData.append('text', newPost.text);
    if (newPost.image) {
      formData.append('image', newPost.image);
    }

    for (const pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/posts/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Post created:', response.data);

      // Close the modal
      setIsModalOpen(false);

      // Refetch posts to get the latest posts
      await fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 pl-10 space-y-6 ml-10">
      <button
        className="fixed bottom-10 right-10 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none transition transform hover:scale-110"
        onClick={() => setIsModalOpen(true)}
      >
        <FontAwesomeIcon icon={faPlus} size="lg" />
        <span>Add Post</span>
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="bg-white rounded-lg shadow-xl p-8 w-96 mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <h2 className="text-2xl mb-4">Create New Post</h2>
        <textarea
          name="text"
          value={newPost.text}
          onChange={handleNewPostChange}
          placeholder="What's on your mind?"
          className="w-full border border-gray-300 rounded-lg p-2 mb-4"
        />
        <input
          type="file"
          name="image"
          onChange={handleNewPostChange}
          className="mb-4"
        />
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleNewPostSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Post
          </button>
        </div>
      </Modal>

      {posts.map(post => (
        <div
          className="bg-gradient-to-r from-blue-100 via-pink-100 to-purple-100 shadow-md rounded-lg p-6 w-[160%] ml-auto "    //transition transform hover:scale-105 hover:shadow-lg
          key={post.id}
        >
          <div className="flex items-center mb-4">
            {post?.user_details?.image ? (
              <div className="flex items-center">
                <img
                  src={`http://127.0.0.1:8000${post.user_details.image}`}
                  alt="Profile"
                  className="w-8 h-8 rounded-full mr-2 mb--1"
                />
              </div>
            ) : (
              <img
                src="https://pbs.twimg.com/media/FjU2lkcWYAgNG6d.jpg"
                alt="Profile"
                className="w-8 h-8 rounded-full mr-2"
              />
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{post?.user_details?.username}</h2>
              <p className="text-gray-600 text-sm">{new Date(post.created_at).toLocaleString()}</p>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-gray-700">{post.text}</p>
            {post.image && <img src={`http://127.0.0.1:8000${post.image}` || 'https://pbs.twimg.com/media/FjU2lkcWYAgNG6d.jpg'} alt="Post Image" className="mt-4 rounded-md w-full h-64 object-cover" />}
          </div>
          <div className="flex justify-between mb-4 space-x-2">
            <button
              className={`px-2 py-1 bg-white text-gray-800 rounded-md ${post.liked ? 'bg-green-300' : ''} text-sm`}
              onClick={() => handleLikePost(post.id)}
            >
              <FontAwesomeIcon icon={faThumbsUp} /> Like {post.liked ? post.like_count : post.likes.length}
            </button>
            <button className="px-2 py-1 bg-white text-gray-800 rounded-md hover:bg-pink-300 text-sm">
              <FontAwesomeIcon icon={faComment} /> Comment
            </button>
            <button className="px-2 py-1 bg-white text-gray-800 rounded-md hover:bg-purple-300 text-sm">
              <FontAwesomeIcon icon={faShare} /> Share
            </button>
          </div>
          <div>
            {post.comments.map((comment, index) => (
              <div key={index} className="border-t border-gray-200 pt-4">
                <p className="text-gray-700">{comment.user.username}: {comment.comment}</p>
              </div>
            ))}
            <div>
              <input
                type="text"
                value={newComment[post.id] || ''}
                onChange={(e) => handleCommentChange(post.id, e.target.value)}
                placeholder="Add a comment..."
                className="border rounded w-full py-2 px-3"
              />
              <button onClick={() => handleCommentSubmit(post.id)} className="bg-green-500 text-white px-4 py-2 rounded-md mt-2">
                Submit
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Post;
