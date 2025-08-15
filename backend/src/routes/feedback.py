from flask import (
    Blueprint,
    jsonify,
    request
)

from src.models import Feedback

blueprint = Blueprint('feedback', __name__)


@blueprint.route('/api/v1/feedback', methods=['POST'])
def create_feedback():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify(error='No data provided'), 400
            
        name = data.get('name')
        email = data.get('email')
        message = data.get('message')
        
        if not all([name, email, message]):
            return jsonify(error='Name, email, and message are required'), 400
        
        feedback = Feedback.create(
            name=name.strip(),
            email=email.strip(),
            message=message.strip()
        )
        
        return jsonify(
            message='Feedback submitted successfully',
            feedback=feedback.to_dict()
        ), 201
        
    except Exception as e:
        return jsonify(error=str(e)), 500


@blueprint.route('/api/v1/feedback', methods=['GET'])
def get_feedback():
    try:
        feedback_list = Feedback.list()
        feedback_data = [feedback.to_dict() for feedback in feedback_list]
        
        return jsonify(feedback=feedback_data), 200
        
    except Exception as e:
        return jsonify(error=str(e)), 500