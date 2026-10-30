import { useCallback, useEffect, useState } from 'react'

const API = 'http://localhost:5000/api'

export default function App() {
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [userForm, setUserForm] = useState({ name: '', email: '' })
  const [postForm, setPostForm] = useState({ title: '', content: '', userId: '' })
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const [usersResponse, postsResponse] = await Promise.all([
        fetch(`${API}/users`),
        fetch(`${API}/posts`)
      ])
      const usersData = await usersResponse.json()
      const postsData = await postsResponse.json()
      if (!usersResponse.ok) throw new Error(usersData.message || 'Unable to load users.')
      if (!postsResponse.ok) throw new Error(postsData.message || 'Unable to load posts.')
      setUsers(usersData)
      setPosts(postsData)
      setPostForm(current => ({
        ...current,
        userId: current.userId || usersData[0]?._id || ''
      }))
    } catch (error) {
      setMessage({ type: 'error', text: `${error.message} Make sure MongoDB and the backend are running.` })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const submitUser = async event => {
    event.preventDefault()
    setBusy(true)
    setMessage({ type: '', text: '' })
    try {
      const response = await fetch(`${API}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm)
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Could not create user.')
      setUserForm({ name: '', email: '' })
      setMessage({ type: 'success', text: 'User created successfully.' })
      await loadData()
      setPostForm(current => ({ ...current, userId: data.user._id }))
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setBusy(false)
    }
  }

  const submitPost = async event => {
    event.preventDefault()
    setBusy(true)
    setMessage({ type: '', text: '' })
    try {
      const response = await fetch(`${API}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postForm)
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Could not create post.')
      setPostForm(current => ({ ...current, title: '', content: '' }))
      setMessage({ type: 'success', text: 'Post created and linked to its user.' })
      await loadData()
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-inner">
          <div className="brand-mark">DB</div>
          <div className="hero-copy">
            <span className="eyebrow">TASK 34 · FULL STACK MINI PROJECT</span>
            <h1>Schema <em>References</em></h1>
            <p>Connect users and posts with MongoDB, Mongoose and React.</p>
          </div>
          <div className="connection"><span /> MongoDB + Express API</div>
        </div>
      </header>

      <main className="content">
        {message.text && <div className={`notice ${message.type}`}>{message.text}</div>}

        <section className="forms-grid">
          <form className="panel form-panel" onSubmit={submitUser}>
            <div className="panel-title">
              <div className="number">01</div>
              <div><span className="eyebrow">USER COLLECTION</span><h2>Create a user</h2></div>
            </div>
            <label>Full name<input required value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })} placeholder="e.g. Saloni Sendhav" /></label>
            <label>Email address<input required type="email" value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} placeholder="name@example.com" /></label>
            <button className="primary-btn" disabled={busy} type="submit">{busy ? 'Please wait…' : '＋ Add user'}</button>
          </form>

          <form className="panel form-panel" onSubmit={submitPost}>
            <div className="panel-title">
              <div className="number purple">02</div>
              <div><span className="eyebrow">POST COLLECTION</span><h2>Create a post</h2></div>
            </div>
            <label>Post title<input required value={postForm.title} onChange={e => setPostForm({ ...postForm, title: e.target.value })} placeholder="Enter a post title" /></label>
            <label>Post content<textarea required rows="3" value={postForm.content} onChange={e => setPostForm({ ...postForm, content: e.target.value })} placeholder="Write something…" /></label>
            <label>Link to user<select required value={postForm.userId} onChange={e => setPostForm({ ...postForm, userId: e.target.value })}>
              <option value="">Select a user</option>
              {users.map(user => <option key={user._id} value={user._id}>{user.name} · {user.email}</option>)}
            </select></label>
            <button className="primary-btn purple-btn" disabled={busy || users.length === 0} type="submit">{busy ? 'Please wait…' : '＋ Publish post'}</button>
            {users.length === 0 && <small className="helper">Create a user first to link a post.</small>}
          </form>
        </section>

        <section className="panel posts-panel">
          <div className="posts-heading">
            <div><span className="eyebrow">POPULATED MONGOOSE QUERY</span><h2>Posts with author details</h2><p>Each post below includes its referenced User document.</p></div>
            <div className="post-count">{posts.length}<small>POSTS</small></div>
          </div>
          {loading ? <div className="empty">Loading records…</div> :
            posts.length === 0 ? <div className="empty"><div className="empty-icon">↗</div><strong>No posts yet</strong><span>Create a user, then publish a post linked to that user.</span></div> :
            <div className="post-list">{posts.map(post => <article className="post-card" key={post._id}>
              <div className="post-top"><span className="post-label">POST</span><time>{new Date(post.createdAt).toLocaleDateString()}</time></div>
              <h3>{post.title}</h3><p className="post-content">{post.content}</p>
              <div className="author"><div className="author-avatar">{post.user?.name?.charAt(0)?.toUpperCase() || '?'}</div><div><strong>{post.user?.name || 'User unavailable'}</strong><span>{post.user?.email || 'No email available'}</span></div><span className="ref-tag">↗ populated user</span></div>
            </article>)}</div>}
          <button className="refresh-btn" type="button" onClick={loadData}>↻ Refresh posts</button>
        </section>
        <div className="tech-note"><span>UNDER THE HOOD</span><code>Post.find().populate('user', 'name email')</code><span className="tech-caption">Mongoose reference + populate()</span></div>
      </main>
      <footer>Task 34 <span>React · Express.js · MongoDB · Mongoose</span></footer>
    </div>
  )
}
