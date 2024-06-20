import React from 'react';
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

const Button = ({ children, ...props }) => (
  <button className='button' {...props}>{children}</button>
);

const App = () => {
  const [friends, setFriends] = React.useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = React.useState(false);
  const [selectedFriend, setSelectedFriend] = React.useState(null);

  const handleShowAddFriend = () => {
    setShowAddFriend((e) => !e);
  };

  const handleAddFriend = (newFriend) => {
    setFriends((friends) => [...friends, newFriend]);
    setShowAddFriend(false);
  }

  const handleSelection = (friend) => {
    setSelectedFriend(selectedFriend => selectedFriend?.id === friend.id ? null : friend);
    setShowAddFriend(false);
  }

  const handleSplitBill = (value) => {
    setFriends((friends) => friends.map((friend) => {
      if (friend.id === selectedFriend.id) {
        return { ...friend, balance: friend.balance + value };
      }
      return friend;
    }
    ));
    setSelectedFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />
        {showAddFriend && <AddFriendForm onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowAddFriend}>{showAddFriend ? 'Close' : 'Add Friend'}</Button>
      </div>
      {!!selectedFriend && (
        <SplitBillForm
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
          key={selectedFriend.id}
        />
      )}
    </div>
  );
}

const FriendList = ({ friends, onSelection, selectedFriend }) => {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          key={friend.id}
          friend={friend}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

const Friend = ({ friend, onSelection, selectedFriend }) => {
  const { image, name, balance, id } = friend;
  const isSelected = selectedFriend?.id === id;
  return (
    <li className='friend'>
      <img src={image} alt={name} />
      <h3>{name}</h3>
      {balance < 0 && <p className='red'>You owe {name} ${Math.abs(balance)}</p>}
      {balance > 0 && <p className='green'>{name} owes you ${Math.abs(balance)}</p>}
      {balance === 0 && <p className='neutral'>You and {name} are even</p>}
      <Button onClick={() => onSelection(friend)}>{isSelected ? 'Close' : 'Select'}</Button>
    </li>
  );
}

const AddFriendForm = ({ onAddFriend }) => {
  const [name, setName] = React.useState('');
  const [img, setImg] = React.useState('https://i.pravatar.cc/48');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !img) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${img}?u=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);

    setName('');
    setImg('https://i.pravatar.cc/48');
  };

  return (
    <form className='form-add-friend' onSubmit={handleSubmit}>
      <label htmlFor='name'>👭Friend Name</label>
      <input type='text' placeholder='Enter Name' value={name} onChange={(e) => setName(e.target.value)} />
      <label htmlFor='img'>🌆 Image URL</label>
      <input type='text' placeholder='Enter URL' value={img} onChange={(e) => setImg(e.target.value)} />
      <Button type='submit'>Add</Button>
    </form>
  );
}

const SplitBillForm = ({ selectedFriend, onSplitBill }) => {
  const { name } = selectedFriend;
  const [bill, setBill] = React.useState(0);
  const [paidByMe, setPaidByMe] = React.useState('');
  const paidByFriend = bill ? bill - paidByMe : 0;
  const [whoIsPaying, setWhoIsPaying] = React.useState('me');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bill || !paidByMe) return;
    onSplitBill(whoIsPaying === 'me' ? paidByFriend : -paidByMe);
  }

  return (
    <form className='form-split-bill' onSubmit={handleSubmit}>
      <h2>Split a bill with {name}</h2>
      <label htmlFor='bill-value'>💰 Bill Value</label>
      <input
        name='bill-value'
        type='text'
        placeholder='0.00'
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label htmlFor='my-expense'>🧍‍♀️ Your Expense</label>
      <input
        name='my-expense'
        type='text'
        placeholder='0'
        value={paidByMe}
        onChange={(e) => setPaidByMe(
          Number(e.target.value) > bill ? paidByMe : Number(e.target.value)
        )}
      />
      <label htmlFor='your-expense'>🧍‍♂️ {name}'s Expense</label>
      <input name='your-expense' type='text' disabled value={paidByFriend} />
      <label htmlFor='split'>💸 Who's paying the bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value='me'>Me</option>
        <option value='friend'>Friend</option>
      </select>
      <Button type='submit'>Split</Button>
    </form>
  );
}

export default App;
