from flask import Blueprint, jsonify, render_template, request, redirect, url_for, flash, session


main = Blueprint('main', __name__)

@main.route('/')
def home():
    return render_template("main/home.html")
