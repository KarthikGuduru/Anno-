from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/submit', methods=['POST'])
def submit():
    data = request.json
    with open("annotations.json", "a") as f:
        f.write(str(data) + '\n')
    return jsonify({"message": "Annotation saved successfully"})

if __name__ == "__main__":
    app.run(debug=True)
