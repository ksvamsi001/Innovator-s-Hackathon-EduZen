from flask import Blueprint, jsonify, render_template, request, redirect, url_for, flash, session
from edu_zen.models import dbs
import bson
from pprint import pprint

faculty = Blueprint('faculty', __name__)

@faculty.route('/create-question')
def create_question():
    return render_template("faculty/create_question.html")

@faculty.route('/receive-mcq', methods=["POST"])
def recieve_mcq():
    mcq_ques = request.json
    dbs["mcq_questions"].insert_one(mcq_ques)
    return jsonify({"message": "Question added successfully"}), 200

@faculty.route('/receive-para', methods=["POST"])
def receive_para():
    para_ques = request.json
    dbs["para_questions"].insert_one(para_ques)
    return jsonify({"message": "Question added successfully"}), 200

@faculty.route('/receive-choose', methods=["POST"])
def receive_choose():
    choose_ques = request.json
    dbs["choose_questions"].insert_one(choose_ques)
    return jsonify({"message": "Question added successfully"}), 200

@faculty.route('/receive-rating', methods=["POST"])
def receive_rating():
    rating_ques = request.json
    dbs["rating_questions"].insert_one(rating_ques)
    return jsonify({"message": "Question added successfully"}), 200

@faculty.route('/view-question')
def view_question():
    mcq_ques = list(dbs["mcq_questions"].find())
    para_ques = list(dbs["para_questions"].find())
    rating_ques = list(dbs["rating_questions"].find())
    choose_ques = list(dbs["choose_questions"].find())
    pprint(mcq_ques)
    pprint(para_ques)
    pprint(rating_ques)
    pprint(choose_ques)
    return render_template("faculty/view_question.html", mcq_ques=mcq_ques, rating_ques=rating_ques, para_ques=para_ques, choose_ques=choose_ques)

@faculty.route("/del-ques/<id>", methods=['POST'])
def delete_ques(id):
    id = bson.ObjectId(id)

    mcq_ques_to_delete = dbs["mcq_questions"].find_one({'_id': id})
    para_ques_to_delete = dbs["para_questions"].find_one({'_id': id})
    rating_ques_to_delete = dbs["rating_questions"].find_one({'_id': id})
    choose_ques_to_delete = dbs["choose_questions"].find_one({'_id': id})

    if mcq_ques_to_delete:
        dbs["mcq_questions"].delete_one({'_id': id})
        flash("MCQ question deleted successfully", "success")
    elif para_ques_to_delete:
        dbs["para_questions"].delete_one({'_id': id})
        flash("Paragraph question deleted successfully", "success")
    elif rating_ques_to_delete:
        dbs["rating_questions"].delete_one({'_id': id})
        flash("Rating question deleted successfully", "success")
    elif choose_ques_to_delete:
        dbs["choose_questions"].delete_one({'_id': id})
        flash("Choose question deleted successfully", "success")
    else:
        flash("Question not found", "error")

    return redirect(url_for("faculty.view_question"))

@faculty.route('/user-list')
def user_list():
    users = list(dbs["student_details"].find()) 
    return render_template("faculty/user_list.html", users=users)

@faculty.route('/add-student', methods=["POST"])
def add_student():
    name = request.form.get('name').strip().lower()
    regno = request.form.get('regno').strip()
    password = request.form.get('password').strip()
    dept = request.form.get('dept').strip()
    data = {
        "student_name" : name,
        "student_regno" : regno,
        "student_dept" : dept,
        "student_password" : password,
    }
    existing_user = dbs["student_details"].find_one({'student_regno': regno})

    if existing_user is None:
        dbs["student_details"].insert_one(data)
        flash(f"User {name.title()} added successfully", "success")
    else:
        flash(f"User {name.title()} already exists. Please use a different regno.", "error")
    return redirect(url_for("faculty.user_list"))

@faculty.route("/del-student-<id>", methods=['POST'])
def delete_student(id):
    id = bson.ObjectId(id)
    student_to_delete = dbs["student_details"].find_one({'_id': id} ,{"student_regno":1, "student_name":1})

    if student_to_delete:
        dbs["student_details"].delete_one({'_id': id})
        flash(f"{student_to_delete['student_name'].title()} records are deleted successfully", "success")
    else:
        flash(f"student with regno {student_to_delete['student_regno']} not found", "error")

    return redirect(url_for("faculty.user_list"))

@faculty.route("/view-student-response/<id>", methods=['POST','GET'])
def view_student_response(id):
    id = bson.ObjectId(id)
    student_details = dbs["student_details"].find_one({'_id': id})
    student_regno = student_details.get("student_regno")
    data = dbs["survey_responses"].find_one({"student_regno":student_regno})
    questions = data.get("facutly_response")
    mcq_questions = []
    para_questions = []
    rating_questions = []
    choose_questions = []
    pprint(questions)
    for question in questions:
        if question['type'] == "mcq":
            mcq_questions.append(question)
        elif question['type'] == "para":
            para_questions.append(question)
        elif question['type'] == "rating":
            rating_questions.append(question)
        elif question['type'] == "choose":
            choose_questions.append(question)
    pprint(mcq_questions)
    pprint(para_questions)
    pprint(rating_questions)
    pprint(choose_questions)

    return render_template("faculty/user_response.html", mcq_ques=mcq_questions, rating_ques=rating_questions, para_ques=para_questions, choose_ques=choose_questions, student_details=student_details)

@faculty.route('/update-rank-<student_id>', methods=["POST"])
def update_rank(student_id):
    student_id = bson.ObjectId(student_id)
    rank = request.form.get("rank")
    dbs['student_details'].update_one({"_id":student_id}, {"$set": {"rank":rank}})
    flash("Mark Updated Successfully",category="success")
    return redirect(url_for("faculty.view_student_response",id=student_id))