# mitchell_rewards/user_management.py

import sqlite3

DATABASE = "database_files/database.db"


def get_db_connection():
    """Establishes and returns a connection to the SQLite database."""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def get_user_by_email(email):
    """
    Retrieves a user from the database by their email address.
    This function is used for login.

    Args:
        email (str): The email address of the user.

    Returns:
        A sqlite3.Row object if the user is found, otherwise None.
    """
    conn = get_db_connection()
    user = None
    try:
        user = conn.execute(
            """
            SELECT u.user_id, u.first_name, u.last_name, u.password_hash, ur.role_name
            FROM users u
            JOIN user_roles ur ON u.role_id = ur.role_id
            WHERE u.email = ?
            """,
            (email,),
        ).fetchone()
    except sqlite3.Error as e:
        print(f"An error occurred while fetching user by email: {e}")
    finally:
        conn.close()
    return user
