const totalLikes = (blogs) =>
  blogs.length === 0
    ? 0
    : blogs.reduce((sum, blog) => sum + blog.likes, 0)

const favoriteBlog = (blogs) =>
  blogs.length === 0
    ? 0
    : blogs.reduce((prev, curr) => prev.likes > curr.likes ? prev : curr)


const mostBlogs = (blogs) => {
  if (blogs.length === 0) return 0

  const countMap = {}

  blogs.forEach(blog => {
    countMap[blog.author] = (countMap[blog.author] || 0) + 1
  })

  let maxAuthor = null
  let maxCount = 0

  for (const author in countMap) {
    if (countMap[author] > maxAuthor) {
      maxAuthor = author,
        maxCount = countMap[author]
    }
  }

  return {
    author: maxAuthor,
    blogs: maxCount
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return 0

  const countLikes = {}

  blogs.forEach(blog => {
    countLikes[blog.author] = (countLikes[blog.author] || 0) + blog.likes
  })

  let maxAuthor = null
  let maxLikes = 0

  for (const author in countLikes) {
    if (countLikes[author] > maxAuthor) {
      maxAuthor = author,
        maxLikes = countLikes[author]
    }
  }

  return {
    author: maxAuthor,
    likes: maxLikes
  }
}

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}