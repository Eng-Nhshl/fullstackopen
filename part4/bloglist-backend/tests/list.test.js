const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')


describe('total likes', () => {

  test('of empty list returns zero', () => {
    const emptyBlog = []

    const result = listHelper.totalLikes(emptyBlog)
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const listWithOneBlog = [{ title: 'E', author: 'Charlie', likes: 5 }]

    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('of a bigger list is calculated right', () => {
    const blogs = [
      { title: 'A', author: 'Alice', likes: 1 },
      { title: 'B', author: 'Bob', likes: 2 },
      { title: 'C', author: 'Alice', likes: 4 },
      { title: 'D', author: 'Bob', likes: 3 },
      { title: 'E', author: 'Charlie', likes: 10 }
    ]

    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 20)
  })
})

describe('favorite blog', () => {

  test('of empty list returns zero', () => {
    const emptyBlog = []

    const result = listHelper.favoriteBlog(emptyBlog)
    assert.strictEqual(result, 0)
  })

  test('returns blog with most likes', () => {
    const blogs = [
      { title: 'A', author: 'Alice', likes: 1 },
      { title: 'B', author: 'Bob', likes: 2 },
      { title: 'C', author: 'Alice', likes: 4 },
      { title: 'D', author: 'Bob', likes: 3 },
      { title: 'E', author: 'Charlie', likes: 10 }
    ]

    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, { title: 'E', author: 'Charlie', likes: 10 })
  })

  test('returns one of the blogs if multiple have same highest likes', () => {
    const blogs = [
      { title: 'A', author: 'Alice', likes: 1 },
      { title: 'B', author: 'Bob', likes: 10 },
      { title: 'C', author: 'Alice', likes: 4 },
      { title: 'D', author: 'Bob', likes: 3 },
      { title: 'E', author: 'Charlie', likes: 10 }
    ]

    const result = listHelper.favoriteBlog(blogs)

    const possibleFavorites = [blogs[1], blogs[4]]

    const isOneOfThem = possibleFavorites.some(blog =>
      blog.title === result.title &&
      blog.author === result.author &&
      blog.likes === result.likes
    )

    assert.ok(isOneOfThem)
  })
})


describe('most blogs', () => {

  test('of empty list returns zero', () => {
    const emptyBlog = []

    const result = listHelper.favoriteBlog(emptyBlog)
    assert.strictEqual(result, 0)
  })

  test('returnes author who has maximum amount of blogs', () => {
    const blogs = [
      { title: 'A', author: 'Charlie', likes: 13 },
      { title: 'B', author: 'Bob', likes: 2 },
      { title: 'C', author: 'Charlie', likes: 10 },
      { title: 'D', author: 'Alice', likes: 4 },
      { title: 'E', author: 'Bob', likes: 3 },
      { title: 'F', author: 'Alice', likes: 1 },
      { title: 'G', author: 'Charlie', likes: 22 }
    ]

    const result = listHelper.mostBlogs(blogs)

    assert.deepStrictEqual(result, { author: 'Charlie', blogs: 3 })
  })

  test('If there are many top bloggers, then it is enough to return any one of them', () => {
    const blogs = [
      { title: 'A', author: 'Charlie', likes: 13 },
      { title: 'B', author: 'Bob', likes: 2 },
      { title: 'C', author: 'Charlie', likes: 10 },
      { title: 'D', author: 'Alice', likes: 4 },
      { title: 'E', author: 'Alice', likes: 54 },
      { title: 'F', author: 'Bob', likes: 3 },
      { title: 'G', author: 'Alice', likes: 1 },
      { title: 'H', author: 'Charlie', likes: 22 },
      { title: 'I', author: 'Alice', likes: 44 }
    ]

    const result = listHelper.mostBlogs(blogs)

    const possibleAuthors = [{ author: 'Charlie', blogs: 3 }, { author: 'Alice', blogs: 3 }]

    const isOneOfThem = possibleAuthors.some(blog =>
      blog.author === result.author &&
      blog.blogs === result.blogs
    )

    assert.ok(isOneOfThem)
  })
})

describe('most likes', () => {

  test('of empty list returns zero', () => {
    const emptyBlog = []

    const result = listHelper.favoriteBlog(emptyBlog)
    assert.strictEqual(result, 0)
  })

  test('returns author, whose blogs posts have the maximum amount of likes', () => {
    const blogs = [
      { title: 'A', author: 'Ali', likes: 33 },
      { title: 'B', author: 'Bob', likes: 2 },
      { title: 'C', author: 'Mohamed', likes: 4 },
      { title: 'D', author: 'Khaled', likes: 3 },
      { title: 'E', author: 'Alice', likes: 1 },
      { title: 'F', author: 'Charlie', likes: 22 }
    ]

    const result = listHelper.mostLikes(blogs)

    assert.deepStrictEqual(result, { author: 'Ali', likes: 33 })
  })

  test('If there are many top bloggers, then it is enough to show any one of them', () => {
    const blogs = [
      { title: 'A', author: 'Ali', likes: 33 },
      { title: 'B', author: 'Bob', likes: 2 },
      { title: 'C', author: 'Mohamed', likes: 4 },
      { title: 'D', author: 'Khaled', likes: 3 },
      { title: 'E', author: 'Alice', likes: 1 },
      { title: 'F', author: 'Charlie', likes: 33 }
    ]

    const result = listHelper.mostLikes(blogs)

    const possibleAuthors = [{ author: 'Ali', likes: 33 }, { author: 'Charlie', likes: 33 }]

    const isOneOfThem = possibleAuthors.some(blog =>
      blog.author === result.author &&
      blog.likes === result.likes
    )

    assert.ok(isOneOfThem)
  })
})