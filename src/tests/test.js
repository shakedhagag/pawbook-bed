import fetch from "node-fetch";

const BASE_URL = "http://localhost:3030";

async function testUserRoutes() {
  const testUser = {
    email: "testuser@example.com",
    password: "testpassword",
    name: "Test User",
  };
  let userId;

  // Test createUser
  //Expect to fail because user already exists

  try {
    const response = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testUser),
    });
    const data = await response.json();
    if (data.message === "User already exists") {
      console.log("Passed: Signup Test");
      userId = data.id;
    } else {
      console.log("Failed: Signup Test. Reason:", data.message);
    }
  } catch (error) {
    console.error("Signup Test Error:", error);
  }

  // Test loginUser
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });
    const data = await response.json();
    userId = data.id;
    if (response.ok) {
      console.log("Passed: Login Test");
    } else {
      console.log("Failed: Login Test. Reason:", data.message);
    }
  } catch (error) {
    console.error("Login Test Error:", error);
  }

  // Test getUserByIdRoute
  if (userId) {
    try {
      const response = await fetch(`${BASE_URL}/user/${userId}`);
      if (response.ok) {
        console.log("Passed: Get User By ID Test");
      } else {
        console.log("Failed: Get User By ID Test");
      }
    } catch (error) {
      console.error("Get User By ID Test Error:", error);
    }
  }

  // Test getAllUsers
  try {
    const response = await fetch(`${BASE_URL}/all-users`);
    if (response.ok) {
      console.log("Passed: Get All Users Test");
    } else {
      console.log("Failed: Get All Users Test");
    }
  } catch (error) {
    console.error("Get All Users Test Error:", error);
  }

  // Test removeUser
  if (userId) {
    try {
      const response = await fetch(`${BASE_URL}/admin/remove-user`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId }),
      });
      if (response.ok) {
        console.log("Passed: Remove User Test");
      } else {
        console.log("Failed: Remove User Test");
      }
    } catch (error) {
      console.error("Remove User Test Error:", error);
    }
  }
}

async function testPostsRoutes() {
  const testUserEmail = "shaked@gmail.com";

  const testPost = {
    email: testUserEmail,
    text: "This is a test post",
    image: "https://example.com/test-image.jpg",
    feeling: "happy",
  };
  let postID;

  // Test createPost
  try {
    const response = await fetch(`${BASE_URL}/create-post`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testPost),
    });
    const data = await response.json();
    if (response.ok) {
      console.log("Passed: Create Post Test");
      postID = data.postID;
    } else {
      console.log("Failed: Create Post Test. Reason:", data.error);
    }
  } catch (error) {
    console.error("Create Post Test Error:", error);
  }

  // Test getAllPosts
  try {
    const response = await fetch(`${BASE_URL}/posts`);
    if (response.ok) {
      console.log("Passed: Get All Posts Test");
    } else {
      console.log("Failed: Get All Posts Test");
    }
  } catch (error) {
    console.error("Get All Posts Test Error:", error);
  }

  // Test deletePost
  if (postID) {
    try {
      const response = await fetch(`${BASE_URL}/delete-post`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: postID }),
      });
      if (response.ok) {
        console.log("Passed: Delete Post Test");
      } else {
        console.log("Failed: Delete Post Test");
      }
    } catch (error) {
      console.error("Delete Post Test Error:", error);
    }
  }
}

await testUserRoutes().then(() => testPostsRoutes());
