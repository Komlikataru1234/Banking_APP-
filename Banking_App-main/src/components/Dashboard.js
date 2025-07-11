import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { MainContent } from "./MainContent";
import { CreateAccountPage } from "./CreateAccountPage";
import { TransferPage } from "./TransferPage";
import { TransactPage } from "./TransactPage";

export const Dashboard = (props) => {
    const [page, setPage] = useState('home');
    const [users, setUsers] = useState(props.users);
    const [notif, setNotif] = useState({ message: '', style: '' });
    const [editingUser, setEditingUser] = useState(null);
    const [deleteUser, setDeleteUser] = useState(null);
    const [editModal, setEditModal] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [newAccount, setNewAccount] = useState(null);

    const changePageHandler = (pageName) => {
        setPage(pageName);

        if (pageName === 'withdraw') {
            setNotif({ message: 'Select an account to withdraw money from.', style: 'left' });
        }

        if (pageName === 'deposit') {
            setNotif({ message: 'Select an account to deposit money.', style: 'left' });
        }
    };

    useEffect(() => {
        if (deleteUser !== null) {
            const filteredUsers = users.filter((_, index) => index !== deleteUser);
            setUsers(filteredUsers);
            setDeleteUser(null);
            localStorage.setItem('users', JSON.stringify(filteredUsers));
        }
    }, [deleteUser, users]);

    useEffect(() => {
        if (isUpdate && newAccount) {
            const updatedUsers = users.map(user => (
                user.number === newAccount.number ? { ...user, ...newAccount } : user
            ));
            setUsers(updatedUsers);
            setIsUpdate(false);
            localStorage.setItem('users', JSON.stringify(updatedUsers));
        }
    }, [isUpdate, newAccount, users]);

    const modal = (editingUser !== null && editModal) ? (
        <AccountEditModal
            accountName={users[editingUser].fullname}
            accountNumber={users[editingUser].number}
            balance={users[editingUser].balance}
            setEditModal={setEditModal}
            setNewAccount={setNewAccount}
            setIsUpdate={setIsUpdate}
        />
    ) : null;

    const sharedProps = {
        changePage: changePageHandler,
        page,
        logoutHandler: props.logoutHandler
    };

    return (
        <main>
            <Sidebar {...sharedProps} />
            {page === 'home' && (
                <>
                    <MainContent
                        users={users}
                        editingUser={editingUser}
                        setEditModal={setEditModal}
                        setEditingUser={setEditingUser}
                        setDeleteUser={setDeleteUser}
                    />
                    {modal}
                </>
            )}
            {page === 'create-account' && <CreateAccountPage users={users} setUsers={setUsers} />}
            {page === 'transfer' && <TransferPage users={users} setUsers={setUsers} />}
            {page === 'deposit' &&
                <TransactPage
                    users={users}
                    setUsers={setUsers}
                    notif={notif}
                    setNotif={setNotif}
                    type="add"
                    page={page}
                />}
            {page === 'withdraw' &&
                <TransactPage
                    users={users}
                    setUsers={setUsers}
                    notif={notif}
                    setNotif={setNotif}
                    type="subtract"
                    page={page}
                />}
        </main>
    );
};

const AccountEditModal = ({ accountName, accountNumber, balance, setEditModal, setNewAccount, setIsUpdate }) => {
    const [account, setAccount] = useState({ fullname: accountName, number: accountNumber, balance });

    const closeModal = () => setEditModal(false);

    const updateAccount = (e) => {
        e.preventDefault();
        setNewAccount(account);
        setIsUpdate(true);
        setEditModal(false);
    };

    const editAccountName = (e) => setAccount({ ...account, fullname: e.target.value });

    const editAccountBalance = (e) => setAccount({ ...account, balance: parseFloat(e.target.value) || 0 });

    return (
        <div className="overlay">
            <div className="modal">
                <form onSubmit={updateAccount}>
                    <h2 className="title">Edit Account</h2>
                    <label>Account name</label>
                    <input name="account-name" onChange={editAccountName} value={account.fullname} autoComplete="off" />

                    <label>Account number</label>
                    <input type="text" name="account-number" value={account.number} disabled autoComplete="off" />

                    <label>Balance</label>
                    <input type="text" name="balance" onChange={editAccountBalance} value={account.balance} autoComplete="off" />

                    <button type="button" onClick={closeModal} className="btn2 btn-muted">Cancel</button>
                    <button type="submit" className="btn2">Update Account</button>
                </form>
            </div>
        </div>
    );
};
