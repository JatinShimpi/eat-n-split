import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ onClick, children }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [showAddfriend, setShowAddfriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handlesplitbill(value) {
    console.log(value)
    setFriends(((friends)=>friends.map(friend=>friend.id===selectedFriend.id ? {...friend,balance:friend.balance + value}:friend)))

    setSelectedFriend(null);
  }

  function handlShowAddFriend() {
    setShowAddfriend((show) => !show);
  }

  function handleAddfriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddfriend(false);
  }

  function handleSelection(friend) {
    //setSelectedFriend(friend);

    setSelectedFriend((curr) => (curr?.id === friend.id ? null : friend));

    setShowAddfriend(false);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />

        {showAddfriend && <Formaddfriend onAddfriend={handleAddfriend} />}

        <Button onClick={handlShowAddFriend}>
          {showAddfriend ? "close " : "Add friend"}
        </Button>
      </div>
      {selectedFriend && (
        <Formsplitbill
          selectedFriend={selectedFriend}
          onSplitbill={handlesplitbill}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend && selectedFriend.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}${" "}
        </p>
      )}
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}${" "}
        </p>
      )}{" "}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}${" "}
        </p>
      )}{" "}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "close" : "Select"}
      </Button>
    </li>
  );
}

function Formaddfriend({ onAddfriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) {
      return;
    }

    const id = crypto.randomUUID();

    const newfriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddfriend(newfriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👯Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>🌇Image url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function Formsplitbill({ selectedFriend, onSplitbill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByfriend = bill ? bill - paidByUser : "";
  const [whoispaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) {
      return;
    }

    onSplitbill(whoispaying === "user" ? paidByfriend : - paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>🤑bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>👤your expence</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />

      <label>👥{selectedFriend.name}'s expence</label>
      <input type="text" disabled value={paidByfriend} />

      <label>
        🤑 who is paying the bill
        <select
          value={whoispaying}
          onChange={(e) => setWhoIsPaying(e.target.value)}
        >
          <option value="user">you</option>
          <option value="friend">{selectedFriend.name}</option>
        </select>
      </label>
      <Button>Split bill</Button>
    </form>
  );
}
