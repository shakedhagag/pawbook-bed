export const getAllFriends = async (req, res) => {
  try {
    const { data } = req;
    const { id } = req.headers;
    if (!id) {
      res.status(400);
      res.json({ message: "Missing user id" });
      res.send();
      return;
    }
    if (!data.users[id]) {
      res.status(404);
      res.json({ message: "User not found" });
      res.send();
      return;
    }
    const friendsData = data.users[id].friends.map((friendId) => {
      const { name, dog_img, owner_img } = data.users[friendId];
      return { friendId, name, dog_img, owner_img };
    });
    res.status(200);
    res.json(friendsData);
  } catch (err) {
    console.log(err);
    res.status(500);
    res.json({ message: "Internal server error" });
    res.send();
  }
};

export const unfollowFriend = async (req, res) => {
  try {
    console.log(req.body);
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
    const friend = data.users[friendId];
    const userIndex = friend.friends.indexOf(id);
    const friendIndex = user.friends.indexOf(friendId);
    if (userIndex === -1) {
      res.status(404);
      res.json({ message: "Friend not found" });
      res.send();
      return;
    }
    if (friendIndex === -1) {
      res.status(404);
      res.json({ message: "Friend not found" });
      res.send();
      return;
    }
    user.friends.splice(friendIndex, 1);
    friend.friends.splice(userIndex, 1);
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
