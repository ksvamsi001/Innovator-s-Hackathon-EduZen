from flask import Blueprint, jsonify, render_template, request, redirect, url_for, flash, session
from edu_zen.models import dbs
import bson
from pprint import pprint

student = Blueprint('student', __name__)

@student.route('/login-student', methods=["POST"])
def login_student():
    if request.method == "POST":
        regno = request.form.get("regno")
        password = request.form.get("password")
        student_login_data = dbs["student_details"].find_one({"student_regno": regno})
        if student_login_data:
            if student_login_data.get("student_password") == password:
                session['student_regno'] = regno
                flash("Login successful", category='success')
                return redirect(url_for("student.exam" , id=student_login_data.get('_id')))
            else:
                flash("Invalid password. Please try again.", category='error')
                return redirect(url_for("main.home"))
        else:
            flash("regno not found. Please try again.", category='error')
            return redirect(url_for("main.home"))
    else:
        return redirect(url_for("main.home"))

@student.route('/student-logout')
def student_logout():
    if 'student_regno' not in session:
        flash("You need to login first", category='error')
        return redirect(url_for("main.home")) 
    session.pop('student_regno', None)
    flash("You have been logged out", category='success')
    return redirect(url_for('main.home'))

def convert_id_to_str(question_list):
    for question in question_list:
        question['_id'] = str(question['_id'])
    return question_list

@student.route('/exam-<id>')
def exam(id):
    if 'student_regno' not in session:
        flash("You need to login first", category='error')
        return redirect(url_for("main.home"))
    
    id = bson.ObjectId(id)
    student_data = dbs["student_details"].find_one({"_id": id})
    if student_data.get("student_regno") != session["student_regno"]:
        flash("You need to login first", category='error')
        return redirect(url_for("main.home"))
    
    mcq_ques = list(dbs["mcq_questions"].find({}, {"crct_options": 0}))
    para_ques = list(dbs["para_questions"].find({}, {"crct_answer": 0}))
    rating_ques = list(dbs["rating_questions"].find({}, {"rated_options": 0}))
    choose_ques = list(dbs["choose_questions"].find({}, {"crct_option": 0}))

    mcq_ques = convert_id_to_str(mcq_ques)
    para_ques = convert_id_to_str(para_ques)
    rating_ques = convert_id_to_str(rating_ques)
    choose_ques = convert_id_to_str(choose_ques)

    if not (mcq_ques or para_ques or rating_ques or choose_ques):
        flash("QP not found error", category='error')
        return redirect(url_for("main.home"))
    else:
        questions = mcq_ques + para_ques + rating_ques + choose_ques

    return render_template("student/exam.html", student_data=student_data, ques=questions)



@student.route('/submit-survey', methods=["POST"])
def submit_survey():
    if 'student_regno' not in session:
        return jsonify({"error": "You need to login first"}), 401
    data = request.json
    response = []
    for ques in data:
        ques_id = bson.ObjectId(ques.get("ques_id"))
        del ques["ques_id"]
        ques_type = ques.get("ques_type")
        ques["type"] = ques.pop("ques_type")
        ques["question"] = ques.pop("ques")
        ques["user_answer"] = ques.pop("ans")
        
        if ques_type == "mcq":
            mcq_ques = dbs["mcq_questions"].find_one({"_id":ques_id}, {"_id":0,"crct_options": 1, "all_options":1})
            ques["crct_options"] = mcq_ques.get("crct_options")
            ques["all_options"] = mcq_ques.get("all_options")

        elif ques_type == "para":    
            para_ques = dbs["para_questions"].find_one({"_id":ques_id}, {"_id":0,"crct_answer": 1})
            ques["crct_answer"] = para_ques.get("crct_answer")

        elif ques_type == "rating":
            rating_ques = dbs["rating_questions"].find_one({"_id":ques_id}, {"_id":0,"rated_options": 1, "all_options":1})
            ques["rated_options"] = rating_ques.get("rated_options")
            ques["all_options"] = rating_ques.get("all_options")

        elif ques_type == "choose":
            choose_ques = dbs["choose_questions"].find_one({"_id":ques_id}, {"_id":0,"crct_option": 1, "all_options":1})
            ques["crct_option"] = choose_ques.get("crct_option")
            ques["all_options"] = choose_ques.get("all_options")
        response.append(ques)
    pprint(response)
    end_response = {
        "student_regno": session["student_regno"],
        "facutly_response":response
    }
    dbs["survey_responses"].delete_one({"student_regno":session["student_regno"]})
    dbs["survey_responses"].insert_one(end_response)

    dbs["student_details"].update_one({"student_regno": session["student_regno"]}, { "$set": { "attended": True } })
    return jsonify({"message": "Survey submitted successfully"}), 200

@student.route('/result')
def result():
    student_id = dbs["student_details"].find_one({"student_regno": session['student_regno']},{"_id":1}).get("_id")
    student_data = dbs["student_details"].find_one({"_id": student_id})
    return render_template("student/result.html",student_id=str(student_id), student_data=student_data)