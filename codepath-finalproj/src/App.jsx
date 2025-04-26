import { useState } from "react";
import "./App.css";

function App() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState("home"); 
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [sortType, setSortType] = useState("time");
  const [searchQuery, setSearchQuery] = useState("");

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newImage, setNewImage] = useState("");

  // These need to exist always, even if not used right now
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedImage, setEditedImage] = useState("");
  const [newComment, setNewComment] = useState("");

  function handleCreatePost() {
    if (!newTitle.trim()) {
      alert("Title is required!");
      return;
    }
    const newPost = {
      id: Date.now(),
      title: newTitle,
      content: newContent,
      image: newImage,
      createdAt: new Date().toLocaleString(),
      upvotes: 0,
      comments: []
    };
    setPosts([newPost, ...posts]);
    setNewTitle("");
    setNewContent("");
    setNewImage("");
    setPage("home");
  }

  function handleUpvote(postId) {
    setPosts(posts.map(post => post.id === postId ? {...post, upvotes: post.upvotes + 1} : post));
  }

  function handleAddComment(postId, comment) {
    if (!comment.trim()) return;
    setPosts(posts.map(post => post.id === postId ? {...post, comments: [...post.comments, comment]} : post));
    setNewComment(""); // Clear input after comment
  }

  function handleDeletePost(postId) {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setPosts(posts.filter(post => post.id !== postId));
      setPage("home");
    }
  }

  function handleEditPost(postId) {
    setPosts(posts.map(post => post.id === postId ? {...post, title: editedTitle, content: editedContent, image: editedImage} : post));
    setEditMode(false);
    setPage("home");
  }

  const filteredPosts = posts
    .filter(post => post.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => sortType === "time" ? b.id - a.id : b.upvotes - a.upvotes);

  if (page === "home") {
    return (
      <div className="container">
        <h1>🏡 My Forum</h1>
        <div className="controls">
          <button onClick={() => setPage("create")}>➕ Create New Post</button>
          <input 
            type="text" 
            placeholder="Search by title..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select onChange={(e) => setSortType(e.target.value)} value={sortType}>
            <option value="time">Sort by Newest</option>
            <option value="upvotes">Sort by Upvotes</option>
          </select>
        </div>

        <div className="post-list">
          {filteredPosts.map(post => (
            <div key={post.id} className="post-card" onClick={() => {
              setSelectedPostId(post.id);
              setEditedTitle(post.title);
              setEditedContent(post.content);
              setEditedImage(post.image);
              setPage("post");
            }}>
              <h3>{post.title}</h3>
              <p>Created at: {post.createdAt}</p>
              <p>Upvotes: {post.upvotes}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (page === "create") {
    return (
      <div className="container">
        <h1>➕ Create New Post</h1>
        <input 
          type="text" 
          placeholder="Post Title (required)" 
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <textarea 
          placeholder="Post Content (optional)" 
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
        />
        <input 
          type="text" 
          placeholder="Image URL (optional)" 
          value={newImage}
          onChange={(e) => setNewImage(e.target.value)}
        />
        <button onClick={handleCreatePost}>Create Post</button>
        <button onClick={() => setPage("home")}>🔙 Back to Home</button>
      </div>
    );
  }

  if (page === "post") {
    const post = posts.find(p => p.id === selectedPostId);

    if (!post) return <div>Post not found.</div>;

    return (
      <div className="container">
        <h1>📝 Post Detail</h1>
        {editMode ? (
          <>
            <input value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} />
            <textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} />
            <input value={editedImage} onChange={(e) => setEditedImage(e.target.value)} />
            <button onClick={() => handleEditPost(post.id)}>Save</button>
            <button onClick={() => setEditMode(false)}>Cancel</button>
          </>
        ) : (
          <>
            <h2>{post.title}</h2>
            <p>Created at: {post.createdAt}</p>
            <p>Upvotes: {post.upvotes}</p>
            {post.image && <img src={post.image} alt="Post" className="post-image" />}
            <p>{post.content}</p>
            <button onClick={() => handleUpvote(post.id)}>👍 Upvote</button>
            <button onClick={() => setEditMode(true)}>✏️ Edit Post</button>
            <button onClick={() => handleDeletePost(post.id)}>🗑️ Delete Post</button>
          </>
        )}

        <h3>Comments</h3>
        <ul>
          {post.comments.map((cmt, idx) => <li key={idx}>{cmt}</li>)}
        </ul>
        <input 
          type="text" 
          placeholder="Leave a comment" 
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={() => handleAddComment(post.id, newComment)}>Add Comment</button>

        <br /><br />
        <button onClick={() => setPage("home")}>🔙 Back to Home</button>
      </div>
    );
  }

  return null;
}

export default App;