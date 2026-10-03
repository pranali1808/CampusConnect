from flask import Flask, send_from_directory, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = "campusconnect-secret-key"
# Database configuration
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///campusconnect.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


# User Table
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

    course = db.Column(db.String(100), default="")
    college = db.Column(db.String(200), default="")
    phone = db.Column(db.String(20), default="")

# Create Database and Table
with app.app_context():
    db.create_all()
    # =========================
# ADD PROFILE COLUMNS
# =========================

from sqlalchemy import text

with app.app_context():
    db.create_all()

    try:
        db.session.execute(
            text("ALTER TABLE user ADD COLUMN course VARCHAR(100) DEFAULT ''")
        )
        db.session.commit()
    except:
        db.session.rollback()

    try:
        db.session.execute(
            text("ALTER TABLE user ADD COLUMN college VARCHAR(200) DEFAULT ''")
        )
        db.session.commit()
    except:
        db.session.rollback()

    try:
        db.session.execute(
            text("ALTER TABLE user ADD COLUMN phone VARCHAR(20) DEFAULT ''")
        )
        db.session.commit()
    except:
        db.session.rollback()
# =========================
# LOGIN CHECK
# =========================

def is_logged_in():
    return "user_id" in session

# =========================
# SIGNUP API
# =========================
@app.route("/signup", methods=["POST"])
def signup():

    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    # Check empty fields
    if not name or not email or not password:
        return jsonify({
            "success": False,
            "message": "All fields are required."
        }), 400

    # Check existing email
    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({
            "success": False,
            "message": "Email already registered."
        }), 400

    # Hash password
    hashed_password = generate_password_hash(password)

    # Create user
    new_user = User(
        name=name,
        email=email,
        password=hashed_password
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Account created successfully."
    })


# =========================
# LOGIN PAGE
# =========================

# =========================
# LOGIN API
# =========================
@app.route("/login", methods=["POST"])
def login_user():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    # Check empty fields
    if not email or not password:
        return jsonify({
            "success": False,
            "message": "Please enter email and password."
        }), 400

    # Find user by email
    user = User.query.filter_by(email=email).first()

    # Check if user exists
    if not user:
        return jsonify({
            "success": False,
            "message": "Invalid email or password."
        }), 401

    # Verify hashed password
    if not check_password_hash(user.password, password):
        return jsonify({
            "success": False,
            "message": "Invalid email or password."
        }), 401

    # Create login session
    session["user_id"] = user.id
    session["user_name"] = user.name

    return jsonify({
        "success": True,
        "message": "Login successful."
    })
# =========================
# LOGOUT API
# =========================
@app.route("/logout", methods=["POST"])
def logout_user():

    session.clear()

    return jsonify({
        "success": True,
        "message": "Logout successful."
    })
# =========================
# LOGIN PAGE
# =========================
@app.route("/")
def login_page():
    return send_from_directory(".", "login.html")
# =========================
# PROTECTED HOME PAGE
# =========================
@app.route("/home")
def protected_home():

    if not is_logged_in():
        return send_from_directory(".", "login.html")

    return send_from_directory(".", "home.html")
# =========================
# PROTECTED PROFILE PAGE
# =========================
@app.route("/profile")
def protected_profile():

    if not is_logged_in():
        return send_from_directory(".", "login.html")

    return send_from_directory(".", "profile.html")
# =========================
# PROTECTED NOTES PAGE
# =========================
@app.route("/notes")
def protected_notes():

    if not is_logged_in():
        return send_from_directory(".", "login.html")

    return send_from_directory(".", "notes.html")
# =========================
# PROTECTED EVENTS PAGE
# =========================
@app.route("/events")
def protected_events():

    if not is_logged_in():
        return send_from_directory(".", "login.html")

    return send_from_directory(".", "events.html")
# =========================
# PROTECTED PLACEMENT PAGE
# =========================
@app.route("/placement")
def protected_placement():

    if not is_logged_in():
        return send_from_directory(".", "login.html")

    return send_from_directory(".", "placement.html")
# =========================
# GET PROFILE API
# =========================
@app.route("/api/profile", methods=["GET"])
def get_profile():

    if not is_logged_in():
        return jsonify({
            "success": False,
            "message": "Please login first."
        }), 401

    user = User.query.get(session["user_id"])

    if not user:
        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    return jsonify({
        "success": True,
        "user": {
            "name": user.name,
            "email": user.email,
            "course": user.course or "",
            "college": user.college or "",
            "phone": user.phone or ""
        }
    })
# =========================
# UPDATE PROFILE API
# =========================
@app.route("/api/profile", methods=["PUT"])
def update_profile():

    if not is_logged_in():
        return jsonify({
            "success": False,
            "message": "Please login first."
        }), 401

    data = request.get_json()

    user = User.query.get(session["user_id"])

    if not user:
        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    user.name = data.get("name", user.name)
    user.email = data.get("email", user.email)
    user.course = data.get("course", user.course)
    user.college = data.get("college", user.college)
    user.phone = data.get("phone", user.phone)

    session["user_name"] = user.name

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Profile updated successfully."
    })

# =========================
# FRONTEND FILES
# =========================
@app.route("/<path:filename>")
def files(filename):
    return send_from_directory(".", filename)


if __name__ == "__main__":
    app.run(debug=True)