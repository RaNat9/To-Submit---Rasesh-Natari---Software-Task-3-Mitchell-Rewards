from flask import Flask, render_template, redirect, url_for

# mitchell_rewards/app.py


def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object("config.Config")
    app.config.from_pyfile(
        "config.py", silent=True
    )  # Load instance config if it exists

    @app.route("/")
    def index():
        return render_template("login.html")  # Default to login

    @app.route("/login")
    def login():
        return render_template("login.html")

    @app.route("/student/dashboard")
    def student_dashboard():
        return render_template("student/dashboard.html")

    @app.route("/student/purchases_history")
    def student_purchases_history():
        return render_template("student/purchases_history.html")

    @app.route("/student/awards_history")
    def student_awards_history():
        return render_template("student/awards_history.html")

    @app.route("/student/about")
    def student_about():
        return render_template("student/about.html")

    @app.route("/teacher/student_search")
    def teacher_student_search():
        return render_template("teacher/student_search.html")

    @app.route("/teacher/rewards_history")
    def teacher_rewards_history():
        return render_template("teacher/rewards_history.html")

    @app.route("/admin/item_shop")
    def admin_item_shop():
        return render_template("admin/item_shop.html")

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
