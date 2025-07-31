# mitchell_rewards/rewards_management.py

import sqlite3

DATABASE = "database_files/database.db"


def get_db_connection():
    """Establishes and returns a connection to the SQLite database."""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def get_all_students():
    """
    Retrieves a list of all users with the 'student' role.
    This is for the teacher's dashboard.

    Returns:
        A list of sqlite3.Row objects representing the students.
    """
    conn = get_db_connection()
    students = []
    try:
        students = conn.execute(
            """
            SELECT u.user_id, u.first_name, u.last_name, u.points
            FROM users u
            JOIN user_roles ur ON u.role_id = ur.role_id
            WHERE ur.role_name = 'student'
            ORDER BY u.last_name ASC, u.first_name ASC
            """
        ).fetchall()
    except sqlite3.Error as e:
        print(f"An error occurred while fetching student list: {e}")
    finally:
        conn.close()
    return students


def get_student_purchase_history(user_id):
    """
    Retrieves the purchase history for a specific student.

    Args:
        user_id (int): The ID of the student.

    Returns:
        A list of sqlite3.Row objects representing the student's purchases.
    """
    conn = get_db_connection()
    purchases = []
    try:
        purchases = conn.execute(
            """
            SELECT p.purchase_date, i.item_name, i.price
            FROM purchases p
            JOIN items i ON p.item_id = i.item_id
            WHERE p.user_id = ?
            ORDER BY p.purchase_date DESC
            """,
            (user_id,),
        ).fetchall()
    except sqlite3.Error as e:
        print(f"An error occurred while fetching purchase history: {e}")
    finally:
        conn.close()
    return purchases
