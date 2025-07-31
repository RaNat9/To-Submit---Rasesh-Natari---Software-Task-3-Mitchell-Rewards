# mitchell_rewards/app.py

from flask import Flask, render_template, request, redirect, url_for, session
import os
import user_management
import rewards_management
import items_shop

app = Flask(__name__)
# A secret key is required for sessions to work.
app.secret_key = os.urandom(24)

# --- Routes ---


@app.route("/")
def home():
    """Redirects to the login page."""
    return redirect(url_for("login"))


@app.route("/login", methods=["GET", "POST"])
def login():
    """
    Handles login logic by verifying credentials against the database
    and redirects based on user role.
    """
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")  # We'll handle this securely later.

        user = user_management.get_user_by_email(email)
        print(email, password, user)
        # IMPORTANT: This is a placeholder. A real application would use
        # a secure password hashing library like `bcrypt` or `Werkzeug`
        # to compare the password with the stored hash.
        if user and (
            password == "password"
        ):  # Assuming 'password' is the plain text password for now
            session["user_id"] = user["user_id"]
            session["user_role"] = user["role_name"]

            if user["role_name"] == "student":
                return redirect(url_for("student_dashboard"))
            elif user["role_name"] == "teacher":
                return redirect(url_for("teacher_dashboard"))
            elif user["role_name"] == "admin":
                return redirect(url_for("admin_shop"))

        return render_template("index.html", error="Invalid email or password")

    return render_template("index.html")


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))


# --- Student Routes ---


@app.route("/student/dashboard")
def student_dashboard():
    """Renders the student's item shop dashboard."""
    if not session.get("user_role") == "student":
        return redirect(url_for("login"))

    # Fetch active items from the new items_shop module
    items = items_shop.get_all_active_items()

    # NOTE: The mock data for user_data and user_roles is still being used here
    # We will fetch this from the database in a future step.
    return render_template(
        "student/dashboard.html",
        items=items,
        user_roles={
            "student": {
                "menuItems": [
                    {
                        "text": "Shop",
                        "href": "/student/dashboard",
                        "page": "student_dashboard",
                    },
                    {
                        "text": "My Purchases",
                        "href": "/student/purchases",
                        "page": "student_purchases",
                    },
                ]
            }
        },
        current_role="student",
        user_data={"id": 1, "name": "John Doe", "role": "student", "points": 1234},
        current_page="student_dashboard",
    )


@app.route("/student/purchases")
def student_purchases():
    """Renders the student's purchases history page."""
    if not session.get("user_role") == "student":
        return redirect(url_for("login"))

    user_id = session.get("user_id")
    purchases = rewards_management.get_student_purchase_history(user_id)

    return render_template(
        "student/purchases_history.html",
        user_roles={
            "student": {
                "menuItems": [
                    {
                        "text": "Shop",
                        "href": "/student/dashboard",
                        "page": "student_dashboard",
                    },
                    {
                        "text": "My Purchases",
                        "href": "/student/purchases",
                        "page": "student_purchases",
                    },
                ]
            }
        },
        current_role="student",
        user_data={"id": 1, "name": "John Doe", "role": "student", "points": 1234},
        rewards=purchases,
        current_page="student_purchases",
    )


# --- Teacher Routes ---


@app.route("/teacher/dashboard")
def teacher_dashboard():
    """Renders the teacher dashboard with a summary of students."""
    if not session.get("user_role") == "teacher":
        return redirect(url_for("login"))

    students = rewards_management.get_all_students()

    return render_template(
        "teacher/dashboard.html",
        user_roles={
            "teacher": {
                "menuItems": [
                    {
                        "text": "Dashboard",
                        "href": "/teacher/dashboard",
                        "page": "teacher_dashboard",
                    },
                    {
                        "text": "Manage Students",
                        "href": "/teacher/manage_students",
                        "page": "teacher_manage_students",
                    },
                ]
            }
        },
        current_role="teacher",
        user_data={"id": 2, "name": "Jane Smith", "role": "teacher"},
        students=students,
        current_page="teacher_dashboard",
    )


@app.route("/teacher/manage_students")
def teacher_manage_students():
    """Renders the teacher's page for managing student points."""
    if not session.get("user_role") == "teacher":
        return redirect(url_for("login"))

    students = rewards_management.get_all_students()

    return render_template(
        "teacher/manage_students.html",
        user_roles={
            "teacher": {
                "menuItems": [
                    {
                        "text": "Dashboard",
                        "href": "/teacher/dashboard",
                        "page": "teacher_dashboard",
                    },
                    {
                        "text": "Manage Students",
                        "href": "/teacher/manage_students",
                        "page": "teacher_manage_students",
                    },
                ]
            }
        },
        current_role="teacher",
        user_data={"id": 2, "name": "Jane Smith", "role": "teacher"},
        students=students,
        current_page="teacher_manage_students",
    )


# --- Admin Routes ---


@app.route("/admin/shop")
def admin_shop():
    """Renders the admin's item shop page with mock data."""
    if not session.get("user_role") == "admin":
        return redirect(url_for("login"))

    # Fetch all items (both active and inactive) for the admin to manage
    # Note: We need a function in items_shop.py for this. For now, we'll use active items.
    items = items_shop.get_all_active_items()

    return render_template(
        "admin/shop.html",
        items=items,
        user_roles={
            "admin": {
                "menuItems": [
                    {"text": "Shop", "href": "/admin/shop", "page": "admin_shop"},
                    {
                        "text": "Analytics",
                        "href": "/admin/analytics",
                        "page": "admin_analytics",
                    },
                ]
            }
        },
        current_role="admin",
        user_data={"id": 3, "name": "Admin User", "role": "admin"},
        current_page="admin_shop",
    )


@app.route("/admin/analytics")
def admin_analytics():
    """Renders a simple analytics dashboard for the admin."""
    if not session.get("user_role") == "admin":
        return redirect(url_for("login"))

    return render_template(
        "admin/analytics.html",
        user_roles={
            "admin": {
                "menuItems": [
                    {"text": "Shop", "href": "/admin/shop", "page": "admin_shop"},
                    {
                        "text": "Analytics",
                        "href": "/admin/analytics",
                        "page": "admin_analytics",
                    },
                ]
            }
        },
        current_role="admin",
        user_data={"id": 3, "name": "Admin User", "role": "admin"},
        current_page="admin_analytics",
    )


if __name__ == "__main__":
    app.run(debug=True)
