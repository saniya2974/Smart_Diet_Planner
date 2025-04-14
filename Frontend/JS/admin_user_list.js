document.addEventListener('DOMContentLoaded', async () => {
    const tableBody = document.querySelector('#userTable tbody');

    try {
        const response = await fetch('http://localhost:3000/users');
        const users = await response.json();

        if (Array.isArray(users)) {
            const filteredUsers = users.filter(user =>
                !(
                    user.username === 'admin' &&
                    user.email === 'admin@gmail.com' &&
                    user.password === 'admin@123'
                )
            );

            if (filteredUsers.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="3">No users found</td></tr>';
                return;
            }

            filteredUsers.forEach(user => {
                const row = document.createElement('tr');

                const usernameCell = document.createElement('td');
                usernameCell.textContent = user.username || 'N/A';

                const emailCell = document.createElement('td');
                emailCell.textContent = user.email || 'N/A';

                const passwordCell = document.createElement('td');
                passwordCell.textContent = user.password || 'N/A';

                row.appendChild(usernameCell);
                row.appendChild(emailCell);
                row.appendChild(passwordCell);

                tableBody.appendChild(row);
            });
        } else {
            tableBody.innerHTML = '<tr><td colspan="3">No users found</td></tr>';
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        tableBody.innerHTML = '<tr><td colspan="3">Error loading users.</td></tr>';
    }
});
