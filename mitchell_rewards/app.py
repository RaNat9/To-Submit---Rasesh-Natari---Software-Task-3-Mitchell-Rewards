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
        return render_template("index.html")

    @app.route("/student/dashboard")
    def student_dashboard():
        return render_template("student/dashboard.html")

    @app.route("/teacher/student_search")
    def teacher_student_search():
        return render_template("teacher/student_search.html")

    @app.route("/admin/dashboard")
    def admin_dashboard():
        return render_template("admin/dashboard.html")

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
