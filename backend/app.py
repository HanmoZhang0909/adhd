import os
import openai
import fitz  # PyMuPDF
from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from flask_cors import CORS
from flask_uploads import UploadSet, configure_uploads, ALL
import json

app = Flask(__name__)
api = Api(app)
CORS(app, resources={r"/*": {"origins": "*"}})

# 配置文件上传
files = UploadSet('files', ALL)
app.config['UPLOADED_FILES_DEST'] = 'uploads'
configure_uploads(app, files)

# 设置OpenAI API密钥
openai.api_key = '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'

class Predict(Resource):
    def post(self):
        data = request.form
        user_input = data.get("input", "")
        file = request.files.get('file')
        
        content = ""
        if file:
            file_extension = file.filename.split('.')[-1].lower()
            if file_extension == 'pdf':
                try:
                    # 处理PDF文件
                    with fitz.open(stream=file.read(), filetype="pdf") as doc:
                        for page in doc:
                            content += page.get_text()
                except Exception as e:
                    print("Error reading PDF file:", str(e))
                    return jsonify({"error": "Error reading PDF file"})
            else:
                return jsonify({"error": "Unsupported file type"})
        else:
            content = f"Predict the completion time for the task titled '{user_input}' and return only the time in seconds. Do not return any English characters or special characters. Return only the number of seconds as a number."

        if content:
            prompt_content = f"Break down the task '{user_input}' into smaller subtasks and estimate the time required for each subtask for a college student to finish. Return the result in the following JSON format: {{'task_breakdown': {{'task_title': '{user_input}', 'sub_tasks': [{{'task_description': 'sub_description', 'time_seconds': time_prediction}}, {{'task_description': 'sub_description', 'time_seconds': time_prediction}}, {{'task_description': 'sub_description', 'time_seconds': time_prediction}}]}}, 'total_completion_time_seconds': 145}}, again, I am requesting you to return the data as the format I provided, replace all the data from the example I gave you with YOUR prediction. This is mandatory and the data format should be hard coded. Only change the content to your prediction"
        else:
            return jsonify({"error": "No content to process"})

        # 调用OpenAI的ChatCompletion API预测任务完成时间
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": prompt_content}
            ]
        )

        # 提取时间的数字秒数格式
        prediction = response['choices'][0]['message']['content'].strip()
        print("API Response:", prediction)  # 打印API返回的原始数据

        try:
            task_details = json.loads(prediction)
        except json.JSONDecodeError:
            return jsonify({"error": "Error parsing AI response"})

        return jsonify(task_details)

api.add_resource(Predict, '/predict')

if __name__ == '__main__':
    app.run(debug=True)
