import { saveData } from "./data.js";

export const getAllFriends = async (req, res) => {
  try {
    const { data } = req;
    const { id } = req.headers;
    if (!id) {
      res.status(400);
      res.json({ message: "Missing user id" });
      return;
    }
    if (!data.users[id]) {
      res.status(404);
      res.json({ message: "User not found" });
      return;
    }
    if (!data.users[id].friends) {
      res.status(204);
      res.json({ message: "No friends huh?" });
      return;
    }
    const friendsData = data.users[id].friends.map((friendId) => {
      const { name, dog_img, owner_img } = data.users[friendId];
      return { friendId, name, dog_img, owner_img };
    });
    res.json(friendsData);
    res.status(200);
  } catch (err) {
    console.log(err);
    res.status(500);
    res.json({ message: "Internal server error" });
    res.send();
  }
};

export const unfollowFriend = async (req, res) => {
  try {
    const { data } = req;
    const { id } = req.headers;
    const { friendId } = req.body;
    if (!id) {
      res.status(400);
      res.json({ message: "Missing user id" });
      res.send();
      return;
    }
    if (!friendId) {
      res.status(400);
      res.json({ message: "Missing friend id" });
      res.send();
      return;
    }
    if (!data.users[id]) {
      res.status(404);
      res.json({ message: "User not found" });
      res.send();
      return;
    }
    if (!data.users[friendId]) {
      res.status(404);
      res.json({ message: "Friend not found" });
      res.send();
      return;
    }
    const user = data.users[id];
    const friendIndex = user.friends.indexOf(friendId);
    if (friendIndex === -1) {
      res.status(404);
      res.json({ message: "Friend not found" });
      res.send();
      return;
    }
    user.friends.splice(friendIndex, 1);
    saveData(data);
    res.status(200);
    res.json({ message: "Friend removed" });
    res.send();
  } catch (err) {
    console.log(err);
    res.status(500);
    res.json({ message: "Internal server error" });
    res.send();
  }
};

export const followFriend = async (req, res) => {
  try {
    const { data } = req;
    const { id } = req.headers;
    const { friendId } = req.body;
    if (!id) {
      res.status(400);
      res.json({ message: "Missing user id" });
      res.send();
      return;
    }
    if (!friendId) {
      res.status(400);
      res.json({ message: "Missing friend id" });
      res.send();
      return;
    }
    if (!data.users[id]) {
      res.status(404);
      res.json({ message: "User not found" });
      res.send();
      return;
    }
    if (!data.users[friendId]) {
      res.status(404);
      res.json({ message: "Friend not found" });
      res.send();
      return;
    }
    const user = data.users[id];
    if (!user.friends) {
      user.friends = [];
    }
    if (user.friends.includes(friendId)) {
      res.status(400);
      res.json({ message: "Friend already added" });
      res.send();
      return;
    }
    user.friends.push(friendId);
    saveData(data);
    res.status(200);
    res.json({ message: "Friend added" });
    res.send();
  } catch (err) {
    console.log(err);
    res.status(500);
    res.json({ message: "Internal server error" });
    res.send();
  }
};
