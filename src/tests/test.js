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
        method: "POST",
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

async function testFriendsRoutes() {
  const testUserId = "8d16b167-fe3d-49e0-8357-51a2c38c109c";
  const testFriendId = "60f7d249a892b3a50fde365b";

  // Test getAllFriends
  try {
    const response = await fetch(`${BASE_URL}/friends`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        id: testUserId,
      },
    });
    if (response.ok) {
      console.log("Passed: Get All Friends Test");
    } else {
      console.log("Failed: Get All Friends Test");
    }
  } catch (error) {
    console.error("Get All Friends Test Error:", error);
  }

  // Test followFriend
  try {
    const response = await fetch(`${BASE_URL}/friends`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        id: testUserId,
      },
      body: JSON.stringify({ friendId: testFriendId }),
    });
    if (response.ok) {
      console.log("Passed: Follow Friend Test");
    } else {
      console.log("Failed: Follow Friend Test", response.error);
    }
  } catch (error) {
    console.error("Follow Friend Test Error:", error);
  }

  // Test unfollowFriend
  try {
    const response = await fetch(`${BASE_URL}/friends`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        id: testUserId,
      },
      body: JSON.stringify({ friendId: testFriendId }),
    });
    if (response.ok) {
      console.log("Passed: Unfollow Friend Test");
    } else {
      console.log("Failed: Unfollow Friend Test");
    }
  } catch (error) {
    console.error("Unfollow Friend Test Error:", error);
  }
}

async function testProfileRoutes() {
  const testUserId = "8cd036d3-89dd-4080-b958-0e2618a36ce3";
  const testDescription =
    "\"Chillin' with my main pup, ridin' the West Coast vibe. Ain't nothin' like that dogg love, ya dig? From the LBC to wherever I be, my dog always rollin' with me. 🐾 #DoggLife\"";
  const testTitle = "Snoop Doggy Dogg";

  // Test editProfileDesc
  try {
    const response = await fetch(`${BASE_URL}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description: testDescription, id: testUserId }),
    });
    if (response.ok) {
      console.log("Passed: Edit Profile Description Test");
    } else {
      console.log("Failed: Edit Profile Description Test");
    }
  } catch (error) {
    console.error("Edit Profile Description Test Error:", error);
  }

  // Test editProfileTitle
  try {
    const response = await fetch(`${BASE_URL}/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: testTitle, id: testUserId }),
    });
    if (response.ok) {
      console.log("Passed: Edit Profile Title Test");
    } else {
      console.log("Failed: Edit Profile Title Test");
    }
  } catch (error) {
    console.error("Edit Profile Title Test Error:", error);
  }

  // Test getProfileDesc
  try {
    const response = await fetch(`${BASE_URL}/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        id: testUserId,
      },
    });
    const responseBody = await response.json();
    if (
      response.ok &&
      responseBody.description === testDescription &&
      responseBody.title === testTitle
    ) {
      console.log("Passed: Get Profile Description and Title Test");
    } else {
      console.log("Failed: Get Profile Description and Title Test");
    }
  } catch (error) {
    console.error("Get Profile Description and Title Test Error:", error);
  }
}

async function testAdminRoutes() {
  // Test getEnabledPages
  try {
    const response = await fetch(`${BASE_URL}/admin/pages`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseBody = await response.json();
    if (response.ok && responseBody.pages) {
      console.log("Passed: Get Enabled Pages Test");
    } else {
      console.log("Failed: Get Enabled Pages Test");
    }
  } catch (error) {
    console.error("Get Enabled Pages Test Error:", error);
  }

  // Test updateEnabledPages
  try {
    const updatedPages = { items: ["home", "about", "contact"] }; // Sample enabled pages
    const response = await fetch(`${BASE_URL}/admin/pages`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pages: updatedPages }),
    });
    const responseBody = await response.json();
    if (response.ok && responseBody.message === "Pages updated successfully") {
      console.log("Passed: Update Enabled Pages Test");
    } else {
      console.log("Failed: Update Enabled Pages Test");
    }
  } catch (error) {
    console.error("Update Enabled Pages Test Error:", error);
  }

  // Test getAllUsersActivity
  try {
    const response = await fetch(`${BASE_URL}/admin/login-activity`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseBody = await response.json();
    if (response.ok && responseBody.userActivity) {
      console.log("Passed: Get All Users Activity Test");
    } else {
      console.log("Failed: Get All Users Activity Test");
    }
  } catch (error) {
    console.error("Get All Users Activity Test Error:", error);
  }
}

testAdminRoutes();

await testUserRoutes()
  .then(() => testPostsRoutes())
  .then(() => testFriendsRoutes())
  .then(() => testProfileRoutes())
  .then(() => testAdminRoutes());
