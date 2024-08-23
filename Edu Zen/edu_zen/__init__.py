from flask import Flask
from edu_zen.config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Importing all blueprints
    from edu_zen.modules.faculty import faculty
    from edu_zen.modules.student import student
    from edu_zen.modules.main import main
    from edu_zen.modules.errors import errors
    
    # Register all blueprints, setting their URL prefix
    app.register_blueprint(faculty, url_prefix="/faculty")
    app.register_blueprint(student, url_prefix="/student")
    app.register_blueprint(main, url_prefix="/")
    app.register_blueprint(errors)

    return app
