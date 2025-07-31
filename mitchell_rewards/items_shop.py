# mitchell_rewards/items_shop.py

import sqlite3

DATABASE = "database_files/database.db"


def get_db_connection():
    """Establishes and returns a connection to the SQLite database."""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def get_all_active_items():
    """
    Retrieves a list of all active reward items from the database.

    Returns:
        A list of sqlite3.Row objects representing the active items.
    """
    conn = get_db_connection()
    items = []
    try:
        # Assuming the 'items' table has an 'is_active' column (we'll need to add this in the schema)
        items = conn.execute("SELECT * FROM items WHERE is_active = 1").fetchall()
    except sqlite3.Error as e:
        print(f"An error occurred while fetching active items: {e}")
    finally:
        conn.close()
    return items


def update_item_status(item_id, is_active):
    """
    Updates the active status of a reward item.

    Args:
        item_id (int): The ID of the item to update.
        is_active (int): 1 for active, 0 for inactive.

    Returns:
        bool: True if the update was successful, False otherwise.
    """
    conn = get_db_connection()
    try:
        conn.execute(
            "UPDATE items SET is_active = ? WHERE item_id = ?", (is_active, item_id)
        )
        conn.commit()
        return True
    except sqlite3.Error as e:
        print(f"An error occurred while updating item status: {e}")
        return False
    finally:
        conn.close()
